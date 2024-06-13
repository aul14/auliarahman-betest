import UserInfoModel from '../models/UserInfoModel.js';
import bcrypt from 'bcrypt';

export const getAllOrByQuery = async (req, res) => {
    try {
        const { accountNumber, registrationNumber, userName } = req.query;

        let query = {};

        if (accountNumber) {
            query.accountNumber = accountNumber;
        } else if (registrationNumber) {
            query.registrationNumber = registrationNumber;
        } else if (userName) {
            query.userName = userName;
        }

        let userInfo;
        if (Object.keys(query).length > 0) {
            userInfo = await UserInfoModel.findOne(query);
            if (!userInfo) {
                return res.status(404).json({ message: 'User not found' });
            }
        } else {
            userInfo = await UserInfoModel.find();
        }

        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getById = async (req, res) => {
    try {
        const userInfo = await UserInfoModel.findById(req.params.id);
        res.json(userInfo)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const create = async (req, res) => {
    try {

        const { fullName, userName, emailAddress, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new UserInfoModel({
            userId: `user${getTimestamp()}${getRandomNumber(1, 100)}`,
            fullName: fullName,
            userName: userName,
            password: hashPassword,
            accountNumber: `accNum${getTimestamp()}${getRandomNumber(1, 100)}`,
            emailAddress: emailAddress,
            registrationNumber: `regisNum${getTimestamp()}${getRandomNumber(1, 100)}`
        });
        const inserteduser = await user.save();
        res.status(201).json(inserteduser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, userName, emailAddress, password } = req.body;

        const userInfo = await UserInfoModel.findById(id);

        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }

        let hashPassword;
        if (password === "" || password == null) {
            hashPassword = userInfo.password;
        } else {
            hashPassword = await bcrypt.hash(password, 10);
        }

        const dataUser = {
            fullName: fullName,
            userName: userName,
            password: password,
            emailAddress: emailAddress,
        }

        const updated = await UserInfoModel.updateOne({ _id: req.params.id }, { $set: dataUser });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleted = async (req, res) => {
    try {
        const deleted = await UserInfoModel.deleteOne({ _id: req.params.id });
        res.json(deleted)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getTimestamp = () => {
    let now = new Date();
    return Math.floor(now.getTime() / 1000);
}