import dotenv from 'dotenv';
dotenv.config();

import { Oso } from 'oso-cloud';

const apiKey = process.env.OSO_CLOUD_API_KEY;
const oso = new Oso('https://cloud.osohq.com', apiKey);

const id = process.argv[2];
if (!id) {
  throw new Error('Run this script with user\'s id as 2nd argument, for example: `node . Bill`');
}

const authorized = await oso.authorize({ type: 'User', id }, 'read', { type: 'Repository', id: 'tps-reports' });
if (authorized) {
  console.log(`User ${id} is authorized to read tps-reports`);
} else {
  console.log(`User ${id} is not authorized to read tps-reports`);
}
