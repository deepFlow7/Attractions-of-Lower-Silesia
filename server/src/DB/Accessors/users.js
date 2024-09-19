const pool = require('../pool');
const logins = require('./logins');

exports.newUser = async (client, name, surname, mail) => {
  try {
    const { rows } = await client.query('INSERT INTO users (name, surname, mail) VALUES ($1, $2, $3) RETURNING id', [name, surname, mail]);
    return rows[0].id;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};

exports.signUp = async (newUser) => {
  const { name, surname, mail, login, password } = newUser;
  const client = await pool.connect();
  try {
    client.query('BEGIN')
    const userId = await this.newUser(client, name, surname, mail);
    await logins.newLogin(client, userId, login, password, 'user');
    client.query('COMMIT')
  } catch (error) {
    client.query('ROLLBACK')
    throw error;
  } finally {
    client.release();
  }
};

exports.getUsers = async () => {
  try {
    const { rows } = await pool.query(`SELECT id, name, surname, mail, login \
              FROM users, logins WHERE users.id=logins.user_id AND role='user'`);
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

exports.getUser = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    if (rows.length <= 0) {
      throw "User not found";
    }
    return rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

exports.editUser = async (id, name, surname, mail) => {
  try {
    await pool.query('UPDATE users SET name = $1, surname = $2, mail = $3 WHERE id = $4', [name, surname, mail, id]);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

exports.deleteUser = async (id) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

exports.findUserIdByUsername = async (username) => {
  try {
    const result = await pool.query('SELECT id FROM users WHERE name = $1', [username]);
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

exports.blockUser = async (id) => {
  try {
    const { rows } = await pool.query('SELECT role FROM logins WHERE user_id = $1', [id]);
    if (rows.role == 'admin')
      throw "Cannot block admin";
    await pool.query('INSERT INTO blocked_users VALUES ($1, NOW())', [id]);
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

exports.unblockUser = async (id) => {
  try {
    await pool.query('DELETE FROM blocked_users WHERE user_id = $1', [id]);
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

exports.isUserBlocked = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blocked_users WHERE user_id = $1', [id]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking if user is blocked:', error);
    throw error;
  }
}

exports.getBlockedUsers = async () => {
  try {
    const { rows } = await pool.query('SELECT user_id FROM blocked_users');
    return rows.map(row => row.user_id);
  } catch (error) {
    console.error('Error getting blocked users:', error);
    throw error;
  }
};