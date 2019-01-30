require('dotenv').config({ path: __dirname + '/.env' });

const config = {
    API_KEY: process.env.API_KEY || 'a081d106',
    API_SECRET: process.env.API_SECRET || 'bwbRShJzn1m2AJuY',
    NEW_API_SECRET: process.env.NEW_API_SECRET || '',
    API_SECRET_ID: process.env.API_SECRET_ID || '',
    FROM_NUMBER: process.env.FROM_NUMBER || '0674585648',
    ALT_TO_NUMBER: process.env.ALT_TO_NUMBER || '',
    TO_NUMBER: process.env.TO_NUMBER || '',
    MEDIA_ID: process.env.MEDIA_ID || '',
    APP_ID: process.env.APP_ID || '2c79c2e8-6fc9-419b-8e5d-33699ba33a7c',
    PRIVATE_KEY: process.env.PRIVATE_KEY || '',
    DEBUG: process.env.DEBUG === 'true'
};

module.exports = config;