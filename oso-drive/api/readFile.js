'use strict';

const { files } = require('../state');
const oso = require('../oso');

module.exports = async function readFile(req, res) {
  const userId = req.headers.authorization ?? '';
  const { id } = req.query;

  const authorized = await oso.authorize(
    { type: 'User', id: userId },
    'read',
    { type: 'File', id }
  );
  if (!authorized) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const file = files.find(f => f.id === id);
  if (!file) {
    return res.status(404).json({ message: `File ${id} not found` });
  }

  // Get all users that have a role on this file
  const users = groupFactsByUser(
    await oso.get('has_role', null, null, { type: 'File', id })
  );

  return res.json({ file, users });
};

function groupFactsByUser(facts) {
  const rolesByUser = new Map();
  for (const fact of facts) {
    const userId = fact[1].id;
    const role = fact[2];
    if (!rolesByUser.has(userId)) {
      rolesByUser.set(userId, []);
    }
    const existingRoles = rolesByUser.get(userId);
    existingRoles.push(role);
  }

  return Object.fromEntries(rolesByUser.entries());
}