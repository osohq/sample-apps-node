'use strict';

const { files } = require('../state');
const oso = require('../oso');

module.exports = async function createFile(req, res) {
  const { file } = req.body;

  files.push(file);
  if (file.folder) {
    await oso.tell(
      'has_relation', // Fact type
      { type: 'File', id: file.id }, // Resource
      'folder', // Relation
      { type: 'Folder', id: file.folder } // Actor
    );
  }

  return res.json({ file });
};