import apiAdapter from '../../apiAdapter.js';
import dotenv from 'dotenv';
dotenv.config();

const { URL_SERVICE_USERINFO } = process.env;

const api = apiAdapter(URL_SERVICE_USERINFO);

export const getAllOrByQuery = async (req, res) => {
    try {
        const response = await api.get(`api/userinfo/account`, {
            params: {
                ...req.query
            }
        })
        res.json(response.data)
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
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await api.get(`api/userinfo/account/${id}`)
        res.json(response.data)
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
export const create = async (req, res) => {
    try {
        const response = await api.post(`api/userinfo/account`, req.body)
        res.json(response.data)
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
export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await api.put(`api/userinfo/account/${id}`, req.body)
        res.json(response.data)
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
export const destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await api.delete(`api/userinfo/account/${id}`)
        res.json(response.data)
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