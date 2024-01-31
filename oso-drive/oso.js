'use strict';

const { Oso } = require('oso-cloud');

const apiKey = process.env.OSO_CLOUD_API_KEY;
const oso = new Oso('https://cloud.osohq.com', apiKey);

module.exports = oso;