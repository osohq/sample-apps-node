'use strict';

const assert = require('assert');
const { folders } = require('../state');
const oso = require('../oso');

module.exports = async function createFolder(req, res) {
  const folder = req.body;
  assert.ok(folder);
  assert.ok(req.headers.authorization);

  if (folders.find(f => f.id === folder.id)) {
    throw new Error('Folder already exists!');
  }

  folders.push(folder);
  if (folder.folder) {
    const authorized = await oso.authorize(
      { type: 'User', id: userId },
      'write',
      { type: 'Folder', id: folder.folder }
    );

    if (!authorized) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await oso.tell(
      'has_relation', // Fact type
      { type: 'Folder', id: folder.id }, // Resource
      'folder', // Relation
      { type: 'Folder', id: folder.folder } // Actor
    );
  }

  await oso.tell(
    'has_relation', // Fact type
    { type: 'Folder', id: folder.id }, // Resource
    'owner', // Relation
    { type: 'User', id: req.headers.authorization } // Actor
  );

  return res.json({ folder });
};