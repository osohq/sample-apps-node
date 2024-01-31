import dotenv from 'dotenv';
dotenv.config();

import { Oso } from 'oso-cloud';
import fs from 'node:fs';

const apiKey = process.env.OSO_CLOUD_API_KEY;
const oso = new Oso('https://cloud.osohq.com', apiKey);

const policy = fs.readFileSync('./scripts/main.polar', 'utf8');
await oso.policy(policy);

await oso.tell(
  'has_role', // Fact type
  { type: 'User', id: 'Bill' }, // Actor
  'contributor', // Role
  { type: 'Repository', id: 'tps-reports' } // Resource
);

console.log('Done');
