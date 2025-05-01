const AuthController = require('../controllers/auth.controller');
const Researcher = require('../models/researcher.model');

jest.mock('../models/researcher.model');
describe('AuthController:', () => {

    //Login/logout functions
    describe('Login/logout tests:', () => {


        //positive cases for loginFailed and logout functions
        describe('Positive cases for login failure and logout functions:', () => {
            it('Check if loginFailed works', () => {
                const req = {};
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn(),
                };

                AuthController.loginFailed(req, res);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
            });

            it('Check if logout works', () => {
                const req = { logout: jest.fn(cb => cb(null)) };
                const res = { json: jest.fn() };
                const next = jest.fn();

                AuthController.logout(req, res, next);

                expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
            });
        });



        //Negative logout case
        describe('Negative logout case:', () => {
            it('check if logout dont work', () => {
                const req = { logout: jest.fn(cb => cb('Logout failed')) };
                const res = { json: jest.fn() };
                const next = jest.fn();

                AuthController.logout(req, res, next);
                expect(next).toHaveBeenCalledWith('Logout failed')
            });
        });

    })



    //Register functions
    describe('register tests:', () => {
        let req, res;

        beforeEach(() => {
            req = {
                body: {
                    username: 'TestUser',
                    email: 'test@test.com',
                    password: 'testpassword',
                },
            };

            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            jest.clearAllMocks();
        });



        //Positive register cases
        describe('Positive cases for register functions:', () => {

            //Create new user
            it('Check if creating user works', async () => {
                Researcher.findOne.mockResolvedValue(null);


                const newUserMock = {
                    _id: '123',
                    username: 'TestUser',
                    email: 'test@test.com',
                    save: jest.fn().mockResolvedValue(),
                };

                Researcher.mockImplementation(() => newUserMock);

                await AuthController.register(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    message: expect.stringContaining('Registration successful'),
                    researcher: {
                        id: '123',
                        username: 'TestUser',
                        email: 'test@test.com',
                    },
                });
            });
        });



        //Negative register cases 
        describe('Negative cases for register functions:', () => {
            //Email exists
            it('Check if email is already in use', async () => {
                Researcher.findOne.mockResolvedValue({ email: 'testt@test.com' });

                await AuthController.register(req, res);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: 'Email is already taken. Please use a different email.',
                });
            });
        });



        //Edge cases for registrer functions
        describe('Edge cases for register functions:', () => {
            //Check how very long inputs are handled
            it('Check how very long inputs are handled', async () => {
                req.body = {
                    username: 'a'.repeat(1000),
                    email: 'b'.repeat(1000) + '@test.com',
                    password: 'c'.repeat(1000),
                };

                Researcher.findOne.mockResolvedValue(null);

                const newUserMock = {
                    _id: '123',
                    username: req.body.username,
                    email: req.body.email,
                    save: jest.fn().mockResolvedValue(),
                };

                Researcher.mockImplementation(() => newUserMock);

                await AuthController.register(req, res);

                expect(res.status).toHaveBeenCalledWith(200);

            })
        })
    });
});
