require('dotenv').config();
const { Queue } = require('bullmq');

const {REDIS_URL} = process.env;
const fupQueue = new Queue('file-processing', { 
  connection: REDIS_URL,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 1000,
    },
  },
});

module.exports = fupQueue;