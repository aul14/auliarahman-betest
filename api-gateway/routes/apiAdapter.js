import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

const TIMEOUT = process.env.TIMEOUT;

const createAxiosInstance = (baseUrl) => {
    const timeoutValue = parseInt(TIMEOUT) || 5000;

    const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: timeoutValue
    });

    return axiosInstance;
};

export default createAxiosInstance;