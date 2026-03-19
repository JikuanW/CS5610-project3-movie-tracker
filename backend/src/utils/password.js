import { randomBytes, scryptSync } from 'node:crypto';

// Create password hash
function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');

  return `${salt}:${hash}`;
}

// Verify password
function verifyPassword(password, savedPassword) {
  const parts = savedPassword.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const salt = parts[0];
  const savedHash = parts[1];
  const hash = scryptSync(password, salt, 64).toString('hex');

  return hash === savedHash;
}

export { hashPassword, verifyPassword };
