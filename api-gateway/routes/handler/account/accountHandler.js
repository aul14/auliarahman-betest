import apiAdapter from '../../apiAdapter.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const {
    URL_SERVICE_ACCOUNT,
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED
} = process.env;

const api = apiAdapter(URL_SERVICE_ACCOUNT);

export const login = async (req, res) => {
    try {
        const response = await api.post('api/account/login', req.body);
        const data = response.data;

        const accessToken = jwt.sign({ data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
        const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

        res.json({
            accessToken,
            refreshToken
        })
    } catch (error) {
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
        const response = await api.get('api/account/lastlogin');
        res.json(response.data);
    } catch (error) {
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