import bcrypt from 'bcrypt';
import AccountModel from '../models/AccountModel.js';
import apiAdapter from '../utils/apiAdapter.js';
import dotenv from 'dotenv';

dotenv.config();

const { URL_USERINFO_SERVICE } = process.env;

const api = apiAdapter(URL_USERINFO_SERVICE);

export const Login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const checkUser = await api.get(`api/userinfo/account`, {
            params: { userName }
        })

        const match = await bcrypt.compare(password, checkUser.data.password);

        if (!match) {
            return res.status(500).json({ message: 'Wrong password' });
        }

        const date = new Date();

        const account = new AccountModel({
            accountId: `acc${getTimestamp()}${getRandomNumber(1, 100)}`,
            lastLoginDateTime: date,
            userId: checkUser.data.userId
        });

        await account.save();

        const resLogin = {
            userId: checkUser.data.userId,
            fullName: checkUser.data.fullName,
            userName: checkUser.data.userName,
            emailAddress: checkUser.data.emailAddress,
            registrationNumber: checkUser.data.registrationNumber
        }

        res.status(200).json(resLogin);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({
                status: 'error',
                msg: 'service unavailable!'
            })
        }

        if (error.response) {
            // If error.response exists, destructure properties from it
            const { status, data } = error.response;
            return res.status(status).json(data);
        } else {
            // If error.response is undefined, handle the error accordingly
            return res.status(500).json({
                status: 'error',
                msg: error.message
            });
        }
    }
}

export const getAccountsByLastLogin = async (req, res) => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const accounts = await AccountModel.find({ lastLoginDateTime: { $gt: threeDaysAgo } });
        return res.json(accounts);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getTimestamp = () => {
    let now = new Date();
    return Math.floor(now.getTime() / 1000);
}