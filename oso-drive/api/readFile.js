'use strict';

const { files } = require('../state');
const oso = require('../oso');

module.exports = async function readFile(req, res) {
  const userId = req.headers.authorization;
  const { id } = req.query;

  console.log('R', id);
  if (!oso.authorize({ type: 'User', id: userId }, 'read', { type: 'File', id })) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const file = files.find(f => f.id === id);
  if (!file) {
    return res.status(404).json({ message: `File ${id} not found` });
  }

  return res.json({ file });
};