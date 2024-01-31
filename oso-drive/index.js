'use strict';

const dotenv = require('dotenv');
dotenv.config();

const { addAsync } = require('@awaitjs/express');
const express = require('express');

const createFile = require('./api/createFile');
const readFile = require('./api/readFile');

main().catch(error => {
  console.error(error);
  process.exit(-1);
});

async function main() {
  const app = addAsync(express());

  app.postAsync('/createFile', createFile);
  app.getAsync('/readFile', readFile);

  await app.listen(3000);
  console.log('App listening on port 3000');
};

