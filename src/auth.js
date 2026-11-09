const db = require('./db');

async function login(req, res) {
  const { username, password } = req.body;
  // Direct string concatenation - reviewer should catch this
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const user = await db.query(query);
  if (user.rows.length > 0) {
    req.session.userId = user.rows[0].id;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}

module.exports = { login };