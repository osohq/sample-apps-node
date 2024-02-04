'use strict';

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const oso = require('../oso');

main().catch(error => {
  console.error(error);
  process.exit(-1);
});

async function main() {
  const policy = fs.readFileSync('./scripts/main.polar', 'utf8');
  await oso.policy(policy);

  await oso.tell(
    'has_relation',
    { type: 'File', id: 'tps-report.txt' },
    'owner',
    { type: 'User', id: 'Peter' }
  );

  await oso.tell(
    'has_relation',
    { type: 'File', id: 'tps-reports/tps-report.txt' },
    'folder',
    { type: 'Folder', id: 'tps-reports' }
  );

  await oso.tell(
    'has_relation',
    { type: 'Folder', id: 'tps-reports' },
    'organization',
    { type: 'Organization', id: 'initech' }
  );

  await oso.tell(
    'has_role',
    { type: 'User', id: 'Bill' },
    'admin',
    { type: 'Organization', id: 'initech' }
  );

  await oso.tell(
    'has_role',
    { type: 'User', id: 'Peter' },
    'member',
    { type: 'Organization', id: 'initech' }
  );

  await oso.tell(
    'has_role',
    { type: 'User', id: 'Samir' },
    'member',
    { type: 'Organization', id: 'initech' }
  );

  await oso.tell(
    'is_public',
    { type: 'File', id: 'test.txt' }
  );
  await oso.tell(
    'is_readable_by_org',
    { type: 'File', id: 'tps-reports/tps-report.txt' }
  );

  console.log('Done');
}
