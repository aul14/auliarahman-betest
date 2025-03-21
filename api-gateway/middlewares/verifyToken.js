import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const { JWT_SECRET } = process.env;

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: err.message
            });
        }

        req.user = decoded;
        next();
    })
}

