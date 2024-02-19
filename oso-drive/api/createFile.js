'use strict';

const assert = require('assert');
const { files } = require('../state');
const oso = require('../oso');

module.exports = async function createFile(req, res) {
  const { file } = req.body;
  assert.ok(file);
  assert.ok(req.headers.authorization);

  files.push(file);
  if (file.folder) {
    const authorized = await oso.authorize(
      { type: 'User', id: userId },
      'write',
      { type: 'Folder', id: file.folder }
    );

    if (!authorized) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await oso.tell(
      'has_relation', // Fact type
      { type: 'File', id: file.id }, // Resource
      'folder', // Relation
      { type: 'Folder', id: file.folder } // Actor
    );
  }

  await oso.tell(
    'has_relation', // Fact type
    { type: 'File', id: file.id }, // Resource
    'owner', // Relation
    { type: 'User', id: req.headers.authorization } // Actor
  )

  return res.json({ file });
};