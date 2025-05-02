const express = require('express');
const validator = require('../middleware/validation.middleware');
const request = require('supertest');

let app;

//validateSignup
describe('validateSignup:', () => {
    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/signup', validator.validateSignup(), (req, res) => {
            res.status(200).json({ message: 'Passed validation' });
        });
    });

    //Positive cases
    describe('Positive cases:', () => {
        it('should pass when all required fields are valid', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(200);
        });
    });

    //Negative cases
    describe('Negative cases:', () => {
        //missing username
        it('should fail when username is missing', async () => {
            const res = await request(app).post('/signup').send({
                username: '',
                email: 'test@test.com',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(400);
        });

        //missing email
        it('should fail when email is missing', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: '',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(400);
        });

        //missing password
        it('should fail when password is missing', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: ''
            });

            expect(res.statusCode).toBe(400);
        });

        //invalid email
        it('should fail when email is invalid', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(400);
        });

        //short password
        it('should fail when password is too short', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: 'Test1!'
            });

            expect(res.statusCode).toBe(400);
        });
    });

    //Boundary cases
    describe('Boundary cases:', () => {
        //1 below min length
        it('should fail if username is just below min length', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: 'Valid1!' //7 chars
            });

            expect(res.statusCode).toBe(400);
        });

        //exactely 8 chars
        it('should pass if username is exactely 8 characters', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: 'Valid12!' //8 chars
            });

            expect(res.statusCode).toBe(200);
        });

        //missing 1 number
        it('should fail when password has no number', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: 'Valdidpassword?'
            });

            expect(res.statusCode).toBe(400);
        });

        //missing 1 special character
        it('should fail when password has no special character', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Testuser',
                email: 'test@test.com',
                password: 'Validpassword123'
            });

            expect(res.statusCode).toBe(400);
        });
    });

    //Edge cases
    describe('Edge cases:', () => {
        //very short username
        it('should pass when username is very short', async () => {
            const res = await request(app).post('/signup').send({
                username: 'T',
                email: 'test@test.com',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(200);
        });
        //very long username
        it('should pass when username is very long', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Test'.repeat(1000),
                email: 'test@test.com',
                password: 'Validpassword123!'
            });
            expect(res.statusCode).toBe(200);
        });

        //very short email
        it('should pass when email is very short', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Test',
                email: 't@test.com',
                password: 'Validpassword123!'
            });
            expect(res.statusCode).toBe(200);
        });

        //very long email
        it('should pass when email is very long', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Test',
                email: 'a'.repeat(64) + '@' + 'b'.repeat(63) + '.com',
                password: 'Validpassword123!'
            });
            expect(res.statusCode).toBe(200);
        });

        //very long password
        it('should pass when password is very long', async () => {
            const res = await request(app).post('/signup').send({
                username: 'Test',
                email: 'test@test.com',
                password: 'Validpassword123!'.repeat(100)
            });

            expect(res.statusCode).toBe(200);
        });
    });
});


//validateLogin
describe('validateLogin:', () => {

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/login', validator.validateLogin(), (req, res) => {
            res.status(200).json({ message: 'Passed validation' });
        });
    });
    //positive cases
    describe('Positive cases:', () => {
        //All fields valid
        it('should pass when all required fields are valid', async () => {
            const res = await request(app).post('/login').send({
                email: 'test@test.com',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(200);
        });
    });

    //negative cases
    describe('Negative cases:', () => {

        //username missing
        it('should fail when email is missing', async () => {
            const res = await request(app).post('/login').send({
                email: '',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(400);
        });

        //username invalid
        it('should fail when email is invalid', async () => {
            const res = await request(app).post('/login').send({
                email: 'test',
                password: 'Validpassword123!'
            });

            expect(res.statusCode).toBe(400);
        });

        //missing password
        it('should fail when password is missing', async () => {
            const res = await request(app).post('/login').send({
                email: 'test@test.com',
                password: ''
            });

            expect(res.statusCode).toBe(400);
        });
    });

    //edge cases
    describe('Edge cases:', () => {

        //very long email
        it('should pass with a very long email', async () => {
            const res = await request(app).post('/login').send({
                email: 'a'.repeat(64) + '@' + 'b'.repeat(63) + '.com',
                password: 'Valdigpassword123!'
            });

            expect(res.statusCode).toBe(200);
        });

        //very long password
        it('sohuld pass with a very long password', async () => {
            const res = await request(app).post('/login').send({
                email: 'test@test.com',
                password: 'Validpassword'.repeat(100)
            });

            expect(res.statusCode).toBe(200);
        });
    });
});

//validateInput
describe('validateInput', () => {
    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.post('/input', validator.validateInput(), (req, res) => {
            res.status(200).json({ message: 'Passed validation' });
        });
    });

    //positive cases
    describe('Positive cases:', () => {
        it('should pass when title and description are valid', async () => {
            const res = await request(app).post('/input').send({
                title: 'Test',
                description: 'Test description'
            });

            expect(res.statusCode).toBe(200);
        });
    });

    //negative cases
    describe('Negative cases:', () => {
        //missing title
        it('should fail when title is missing', async () => {
            const res = await request(app).post('/input').send({
                title: '',
                description: 'Test description'
            });

            expect(res.statusCode).toBe(400);
        });

        //missing description
        it('should fail when description is missing', async () => {
            const res = await request(app).post('/input').send({
                title: 'Test',
                description: ''
            });

            expect(res.statusCode).toBe(400);
        });
    });

    //edge cases
    describe('Edge cases:', () => {
        //very long title
        it('should pass when title is very long', async () => {
            const res = await request(app).post('/input').send({
                title: 'Test'.repeat(1000),
                description: 'Test description'
            });

            expect(res.statusCode).toBe(200);
        });

        //very short title
        it('should pass when title is very short', async () => {
            const res = await request(app).post('/input').send({
                title: 'T',
                description: 'Test description'
            });

            expect(res.statusCode).toBe(200);
        });

        //very long description
        it('should pass when description is very long', async () => {
            const res = await request(app).post('/input').send({
                title: 'Test',
                description: 'Test description'.repeat(1000)
            });

            expect(res.statusCode).toBe(200);
        });

        //very short description
        it('should pass when description is very short', async () => {
            const res = await request(app).post('/input').send({
                title: 'Test',
                description: 'T'
            });

            expect(res.statusCode).toBe(200);
        });

    });

});