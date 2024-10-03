const pool = require('../pool');
var argon2 = require('argon2');

exports.newLogin = async (client, userId, login, password, role) => {
  try {
    const hash = await argon2.hash(password);
    await client.query('INSERT INTO logins (user_id, login, password, role) VALUES ($1, $2, $3, $4)', [userId, login, hash, role]);
  } catch (error) {
    console.error('Error creating new login:', error);
    throw error;
  }
}

exports.checkLogin = async (login, password) => {
  try {
    const { rows } = await pool.query('SELECT * FROM logins WHERE login=$1', [login]);
    if (rows.length <= 0) {
      throw "User with this login does not exist: " + login;
    }
    const userHash = rows[0].password;
    var check = await argon2.verify(userHash, password);
    return { user: rows[0], check: check };
  }
  catch (error) {
    console.error("Error checking password:", error);
    throw error;
  }
}

exports.editLogin = async (id, login, password) => {
  try {
    const hash = await argon2.hash(password);
    await pool.query('UPDATE logins SET login = $1, password = $2 WHERE id = $3', [login, hash, id]);
  } catch (error) {
    console.error("Error updating login data:", error);
    throw error;
  }
}

exports.deleteLogin = async (id) => {
  try {
    await pool.query('DELETE FROM logins WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting login:', error);
    throw error;
  }
}

exports.getLoginById = async (id) => {
  try {
    const { rows } = await pool.query('SELECT login FROM logins WHERE user_id=$1', [id]);
    if (rows.length <= 0) {
      throw "User not found";
    }
    return rows[0].login;
  } catch (error) {
    console.error('Error fetching login:', error);
    throw error;
  }
}