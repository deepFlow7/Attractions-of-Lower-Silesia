const db = require('../../DB/db_api');

exports.users = async (req, res) => {
  try {
    var users = await db.getUsers();
    res.json(users);
  } catch (error) {
    console.log('Error fetching users: ' + error);
    res.status(500).json({ error: 'Error fetching users:' + error });
  }
};

exports.blocked = async (req, res) => {
  try {
    const blocked = await db.getBlockedUsers();
    res.json({ blockedUsers: blocked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};