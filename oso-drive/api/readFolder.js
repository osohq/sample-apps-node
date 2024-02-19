'use strict';

const { folders } = require('../state');
const oso = require('../oso');

module.exports = async function readFolder(req, res) {
  const userId = req.headers.authorization ?? '';
  const { id } = req.query;

  const authorized = await oso.authorize(
    { type: 'User', id: userId },
    'read',
    { type: 'Folder', id }
  );
  if (!authorized) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const folder = folders.find(f => f.id === id);
  if (!folder) {
    return res.status(404).json({ message: `Folder ${id} not found` });
  }

  // Get all users that have a role on this folder
  const users = groupFactsByUser(
    await oso.get('has_role', null, null, { type: 'Folder', id })
  );

  return res.json({ folder, users });
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