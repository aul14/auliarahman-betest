import * as chai from 'chai'
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import mongoose from 'mongoose';
import { describe, it, beforeEach, afterEach } from 'mocha';
import UserInfoModel from '../models/UserInfoModel.js';
import * as userController from '../controllers/UserInfoController.js';
import bcrypt from 'bcrypt';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const { MONGO_DB_UNIT_TESTING_URL } = process.env;

// Menggunakan chaiHttp
const chaiModule = chai.use(chaiHttp);
const { expect } = chai;

// Inisialisasi express app
const app = express();
app.use(express.json());

// Endpoint yang akan kita test
app.get('/users', userController.getAllOrByQuery);
app.get('/users/:id', userController.getById);
app.post('/users', userController.create);
app.put('/users/:id', userController.update);
app.delete('/users/:id', userController.deleted);

describe('User Controller', () => {
    let findOneStub, findStub, findByIdStub, createStub, updateStub, deleteStub, hashStub;

    before(async () => {
        await mongoose.connect(MONGO_DB_UNIT_TESTING_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        // Mock the methods from UserInfoModel
        findOneStub = sinon.stub(UserInfoModel, 'findOne');
        findStub = sinon.stub(UserInfoModel, 'find');
        findByIdStub = sinon.stub(UserInfoModel, 'findById');
        createStub = sinon.stub(UserInfoModel.prototype, 'save');
        updateStub = sinon.stub(UserInfoModel, 'updateOne');
        deleteStub = sinon.stub(UserInfoModel, 'deleteOne');
        hashStub = sinon.stub(bcrypt, 'hash');
    });

    afterEach(() => {
        // Restore the original methods
        sinon.restore();
    });

    describe('getAllOrByQuery', () => {
        it('should get all users if no query params are provided', async () => {
            const fakeUsers = [{ userName: 'John' }, { userName: 'Jane' }];
            findStub.resolves(fakeUsers);

            const res = await chaiModule.request.execute(app).get('/users');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.deep.equal(fakeUsers);
        });

        it('should get user by accountNumber', async () => {
            const fakeUser = { userName: 'John', accountNumber: '123' };
            findOneStub.withArgs({ accountNumber: '123' }).resolves(fakeUser);

            const res = await chaiModule.request.execute(app).get('/users').query({ accountNumber: '123' });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal(fakeUser);
        });

        it('should return 404 if user not found', async () => {
            findOneStub.resolves(null);

            const res = await chaiModule.request.execute(app).get('/users').query({ accountNumber: '123' });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
        });
    });

    describe('getById', () => {
        it('should get user by id', async () => {
            const fakeUser = { userName: 'John' };
            findByIdStub.resolves(fakeUser);

            const res = await chaiModule.request.execute(app).get('/users/1');

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal(fakeUser);
        });

        it('should return 500 if there is an error', async () => {
            findByIdStub.rejects(new Error('Error'));

            const res = await chaiModule.request.execute(app).get('/users/1');

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message', 'Error');
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const fakeUser = { userName: 'John', password: 'hashedPassword' };
            hashStub.resolves('hashedPassword');
            createStub.resolves(fakeUser);

            const res = await chaiModule.request.execute(app).post('/users').send({
                fullName: 'John Doe',
                userName: 'johndoe',
                emailAddress: 'john@example.com',
                password: 'password123'
            });
            await chaiModule.request.execute(app).post('/users').send({
                fullName: 'John Doe 2',
                userName: 'johndoe2',
                emailAddress: 'john2@example.com',
                password: 'password123'
            });

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('userName', 'John');
        });

        it('should return 500 if there is an error', async () => {
            hashStub.rejects(new Error('Hash Error'));

            const res = await chaiModule.request.execute(app).post('/users').send({
                fullName: 'John Doe',
                userName: 'johndoe',
                emailAddress: 'john@example.com',
                password: 'password123'
            });

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message', 'Hash Error');
        });
    });

    describe('update', () => {
        it('should update user details', async () => {
            const fakeUser = { userName: 'John', password: 'hashedPassword' };
            findByIdStub.resolves(fakeUser);
            hashStub.resolves('newHashedPassword');
            updateStub.resolves({ nModified: 1 });

            const res = await chaiModule.request.execute(app).put('/users/1').send({
                fullName: 'John Doe',
                userName: 'johndoe',
                emailAddress: 'john@example.com',
                password: 'newPassword123'
            });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('nModified', 1);
        });

        it('should return 404 if user not found', async () => {
            findByIdStub.resolves(null);

            const res = await chaiModule.request.execute(app).put('/users/1').send({
                fullName: 'John Doe',
                userName: 'johndoe',
                emailAddress: 'john@example.com',
                password: 'newPassword123'
            });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message', 'User not found');
        });
    });

    describe('deleted', () => {
        it('should delete user by id', async () => {
            deleteStub.resolves({ deletedCount: 1 });

            const res = await chaiModule.request.execute(app).delete('/users/1');

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('deletedCount', 1);
        });

        it('should return 500 if there is an error', async () => {
            deleteStub.rejects(new Error('Delete Error'));

            const res = await chaiModule.request.execute(app).delete('/users/1');

            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message', 'Delete Error');
        });
    });
});