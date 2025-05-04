require("dotenv").config({ path: ".env.test" });

jest.setTimeout(30000);

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Mock auth middleware that simulates an authenticated user
jest.mock("../middleware/auth.middleware.js", () => ({
    ensureAuth: (req, res, next) => {
        req.user = { id: global.testResearcherId };
        next();
    }
}));

const app = require("../server");
const Study = require("../models/study.model");
const Researcher = require("../models/researcher.model");

let mongoServer;

// Set up in-memory MongoDB server before running tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
        binary: { version: "8.0.5" },
    }); 
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
});

// Clean up and close connections
afterAll(async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
    await mongoose.connection.close();
});

// Reset the database before each test
beforeEach(async () => {
    await Study.deleteMany({});
    await Researcher.deleteMany({});

    const researcher = await Researcher.create({
        username: "testresearcher",
        email: "ima@testresearcher.com",
        password: "password123"
    });

    testResearcherId = researcher._id.toString();
});

describe("POST to create a study", () => {
    // Positive test: create a study with valid input
    it("should create a new study and show a 201 http code", async () => {
        const res = await request(app)
            .post("/studies")
            .send({
                name: "which cats are cuter",
                consent: "Do you consent to participate?",
                demographics: { age: true },
                questions: [
                    {
                        type: "multiple_choice",
                        question: "which of these cats would you consider to be cute?"
                    },
                ],
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Study created successfully");
        expect(res.body.study).toHaveProperty("name", "which cats are cuter");
        expect(res.body.study).toHaveProperty("ownerId", testResearcherId);

        const studyInDb = await Study.findOne({ name: "which cats are cuter" });
        expect(studyInDb).not.toBeNull();
        expect(studyInDb.ownerId).toBe(testResearcherId);
    });

    // Negative test: missing all required fields
    it("should return 400 if required fields are missing (negative boundary)", async () => {
        const res = await request(app).post("/studies").send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Validation Error");
        expect(res.body).toHaveProperty("error");
    });

    // Negative test: missing 'type' in the question field
    it("should return 400 if a question is missing the 'type' field", async () => {
        const res = await request(app)
            .post("/studies")
            .send({
                name: "Malformed question input",
                consent: "Please consent to participate",
                demographics: { age: true },
                questions: [
                    {
                        type: "", question: "Is this a valid question?"
                    }
                ]
            });
    
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Validation Error");
        expect(res.body).toHaveProperty("error");
    });

    // Boundary Case: character limit of consent forms
    // Exactly 4000 characters (maxLength)
    it("should accept a study with the consent form being 4000 characters", async () => {
        const mockConsentForm = "a".repeat(4000);

        const res = await request(app)
            .post("/studies")
            .send({
                name: "Study with max allowed characters in the consent form",
                consent: mockConsentForm,
                demographics: { age: true },
                questions: [
                    {
                        type: "preference",
                        question: "which cat do you prefer?"
                    }
                ]
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Study created successfully");
        expect(res.body.study).toHaveProperty("consent", mockConsentForm);

        const studyInDb = await Study.findOne({ name: "Study with max allowed characters in the consent form" });
        expect(studyInDb).not.toBeNull();
        expect(studyInDb.ownerId).toBe(testResearcherId);
        expect(studyInDb.consent).toBe(mockConsentForm);
    });

    // One character over the limit
    it("should reject a study where the consent form is longer than 4000 characters", async () => {
        const mockConsentForm = "a".repeat(4001);

        const res = await request(app)
            .post("/studies")
            .send({
                name: "Study with too long consent form",
                consent: mockConsentForm,
                demographics: { age: true },
                questions: [
                    { type: "rank", question: "how would you rank these cats?" }
                ]
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Validation Error");
        expect(res.body).toHaveProperty("error");
    });

    // One character under the limit
    it("should accept a where the consent form has 3999 characters", async () => {
        const mockConsentForm = "a".repeat(3999);

        const res = await request(app)
            .post("/studies")
            .send({
                name: "study where the consent form is within character limits",
                consent: mockConsentForm,
                demographics: { age: true },
                questions: [
                    { type: "slider", question: "on a scale from 1-10, how cute is this cat?"},
                    { type: "rank", question: "how would you rank these cats in terms of cuteness?"}
                ]
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Study created successfully");
        expect(res.body.study).toHaveProperty("consent", mockConsentForm);

        const studyInDb = await Study.findOne({ name: "study where the consent form is within character limits" });
        expect(studyInDb).not.toBeNull();
        expect(studyInDb.ownerId).toBe(testResearcherId);
        expect(studyInDb.consent).toBe(mockConsentForm);
    });
});
