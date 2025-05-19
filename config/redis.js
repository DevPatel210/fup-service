require('dotenv').config();
const { Queue } = require('bullmq');

const {REDIS_URL} = process.env;
const fupQueue = new Queue('file-processing', { connection: REDIS_URL });

module.exports = fupQueue;