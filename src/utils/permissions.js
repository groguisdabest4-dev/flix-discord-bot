const { PermissionFlagsBits } = require('discord.js');

function hasPermission(member, permission) {
  if (!member) return false;
  return member.permissions.has(permission);
}

function isModerator(member) {
  return hasPermission(member, PermissionFlagsBits.ModerateMembers) ||
    hasPermission(member, PermissionFlagsBits.Administrator);
}

function isAdmin(member) {
  return hasPermission(member, PermissionFlagsBits.Administrator);
}

function isOwner(userId, ownerId) {
  return userId === ownerId;
}

function getUserColor(member) {
  return member?.roles?.highest?.color || '#6d82ff';
}

module.exports = {
  hasPermission,
  isModerator,
  isAdmin,
  isOwner,
  getUserColor
};
