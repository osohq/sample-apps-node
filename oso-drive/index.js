'use strict';

const dotenv = require('dotenv');
dotenv.config();

const { addAsync } = require('@awaitjs/express');
const express = require('express');

const createFile = require('./api/createFile');
const createFolder = require('./api/createFolder');
const readFile = require('./api/readFile');
const readFolder = require('./api/readFolder');
const updateFile = require('./api/updateFile');

main().catch(error => {
  console.error(error);
  process.exit(-1);
});

async function main() {
  const app = addAsync(express());

  app.set('json spaces', 2);

  app.use(express.json());

  app.postAsync('/createFile', createFile);
  app.postAsync('/createFolder', createFolder);
  app.getAsync('/readFile', readFile);
  app.getAsync('/readFolder', readFolder);
  app.putAsync('/updateFile', updateFile);

  await app.listen(3000);
  console.log('App listening on port 3000');
};

