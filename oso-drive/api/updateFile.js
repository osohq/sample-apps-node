'use strict';

const assert = require('assert');
const { files } = require('../state');
const oso = require('../oso');

module.exports = async function updateFile(req, res) {
  const { id, content } = req.body;
  assert.ok(content);
  assert.ok(req.headers.authorization);
  
  const userId = req.headers.authorization ?? '';

  const authorized = await oso.authorize(
    { type: 'User', id: userId },
    'write',
    { type: 'File', id }
  );
  if (!authorized) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const file = files.find(f => f.id === id);
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }

  file.content = content;

  return res.json({ file });
};