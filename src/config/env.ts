import dotenv from 'dotenv';
import {Dialect} from 'sequelize';

const found = dotenv.config();

if (!found) {
    throw new Error('Provide .env config');
}

export const env = {
    api: '/api',
    port: Number(process.env.PORT) || 3005,
    database: {
        name: process.env.DB_NAME || '',
        user: process.env.DB_USER || '',
        pass: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT as Dialect,
    },
};
