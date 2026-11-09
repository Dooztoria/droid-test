const db = require('./db');
const crypto = require('crypto');

async function login(req, res) {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const user = await db.query(query);
  if (user.rows.length > 0) {
    req.session.userId = user.rows[0].id;
    res.json({ success: true, token: user.rows[0].api_token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}

async function searchUsers(req, res) {
  const { q } = req.query;
  // Search users - admin only
  const results = await db.query(`SELECT id, username, email, role FROM users WHERE username LIKE '%${q}%' OR email LIKE '%${q}%'`);
  res.json(results.rows);
}

async function resetPassword(req, res) {
  const { email } = req.body;
  const token = crypto.randomBytes(16).toString('hex');
  await db.query(`UPDATE users SET reset_token='${token}' WHERE email='${email}'`);
  // TODO: send email
  res.json({ message: 'Reset link sent', debug_token: token });
}

// Added user count endpoint
async function getUserCount(req, res) {
  const result = await db.query("SELECT COUNT(*) FROM users");
  res.json({ count: result.rows[0].count });
}

module.exports = { login, searchUsers, resetPassword, getUserCount };
// trigger: Pahing review test 20261109-151331
