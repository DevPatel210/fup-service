const { Worker } = require('bullmq');
const File = require('../models/files');
const fs = require("fs");
require('dotenv').config();

const redisUrl = process.env.REDIS_URL;

const fupWorker = new Worker('file-processing', async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data);
  const {fileId, file} = job.data;
  // update the status in the DB that file is being processeed
  await File.update({status: "processing"}, {where: {id: fileId}});
  
  // dummy timeout mimicking fetching file 
  await new Promise((resolve) => setTimeout(resolve,20000));
  
  const fileData = fs.readFileSync(file.path,'utf-8');
  dataFetched = false;
  await File.update({extractedData: fileData}, {where: {id: fileId}});
  
  // dummy timeout mimicking data processing
  await new Promise((resolve) => setTimeout(resolve,20000));
  console.log("Processing completed")
}, { connection: redisUrl });

fupWorker.on('completed', async (job) => {
  // update the status in DB that file is processed
  console.log(`Job ${job.id} completed successfully`);
  const {fileId} = job.data;
  await File.update({status: "processed"}, {where: {id: fileId}});
});

fupWorker.on('failed', async (job, err) => {
  // update the status in DB that file fetching/processing failed
  console.error(`Job ${job.id} failed with error:`, err);
  const {fileId} = job.data;
  await File.update({status: "failed", extractedData: `Error in extracting data: ${err.message}`}, {where: {id: fileId}});
});

fupWorker.on('error', async (err) => {
  // log the unexpected error
  console.error(err);
});

console.log('FUP service worker started.');