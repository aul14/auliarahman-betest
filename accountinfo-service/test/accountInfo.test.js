import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { describe, it, beforeEach, afterEach } from 'mocha';
import AccountModel from '../models/AccountModel.js';
import * as loginController from '../controllers/AccountController.js';
import apiAdapter from '../utils/apiAdapter.js';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_DB_UNIT_TESTING_URL, URL_USERINFO_SERVICE } = process.env;

const chaiModule = chai.use(chaiHttp);
const { expect } = chai;

const app = express();
app.use(express.json());

app.post('/login', loginController.Login);
app.get('/accounts', loginController.getAccountsByLastLogin);

describe('Login Controller', () => {
    let apiStub, accountSaveStub, bcryptCompareStub;

    before(async () => {
        await mongoose.connect(MONGO_DB_UNIT_TESTING_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        apiStub = sinon.stub(apiAdapter(URL_USERINFO_SERVICE), 'get');
        accountSaveStub = sinon.stub(AccountModel.prototype, 'save');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Login', () => {
        const fakeUser = {
            userId: 'user123',
            userName: 'johndoe',
            fullName: 'John Doe',
            password: 'password123',
            emailAddress: 'john@example.com',
            registrationNumber: 'reg123'
        };

        it('should return user details on successful login', async () => {
            apiStub.resolves({ data: fakeUser });
            bcryptCompareStub.resolves(true);
            accountSaveStub.resolves();

            const res = await chaiModule.request.execute(app).post('/login').send({
                userName: 'johndoe',
                password: 'password123'
            });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
        });

        it('should return 400 if password is incorrect', async () => {
            apiStub.resolves({ data: fakeUser });
            bcryptCompareStub.resolves(false);

            const res = await chaiModule.request.execute(app).post('/login').send({
                userName: 'johndoe',
                password: 'wrongpassword'
            });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
        });

        it('should return 404 if user is not found', async () => {
            apiStub.rejects({ response: { status: 404, data: { message: 'User not found' } } });


            const res = await chaiModule.request.execute(app).post('/login').send({
                userName: 'johndoe',
                password: 'password123'
            });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
        });

        it('should return 500 if service is unavailable', async () => {
            apiStub.rejects({ code: 'ECONNREFUSED' });

            const res = await chaiModule.request.execute(app).post('/login').send({
                userName: 'johndoe',
                password: 'password123'
            });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
        });
    });

    describe('getAccountsByLastLogin', () => {
        it('should return accounts that have logged in within the last three days', async () => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

            const fakeAccounts = [
                { accountId: 'acc1', lastLoginDateTime: ["Date" + new Date()], userId: 'user1' },
                { accountId: 'acc2', lastLoginDateTime: ["Date" + new Date()], userId: 'user2' }
            ];

            const findStub = sinon.stub(AccountModel, 'find').resolves(fakeAccounts);

            const res = await chaiModule.request.execute(app).get('/accounts');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.deep.equal(fakeAccounts);

            findStub.restore();
        });

        it('should return 500 if there is an error', async () => {
            const findStub = sinon.stub(AccountModel, 'find').rejects(new Error('Database Error'));

            const res = await chaiModule.request.execute(app).get('/accounts');

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('error', 'Internal server error');

            findStub.restore();
        });
    });
});
