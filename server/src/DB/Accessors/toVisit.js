const pool = require('../pool');

exports.isToVisit = async (attractionId, userId) => {
  try {
    const result = await pool.query('SELECT * FROM wants_to_visit WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error fetching attraction to visit :', error);
    throw error;
  }
}

exports.changeWantsToVisit = async (userId, attractionId) => {
  try {
    const existingEntry = await pool.query('SELECT * FROM wants_to_visit WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
    if (existingEntry.rowCount > 0) {
      await pool.query('DELETE FROM wants_to_visit WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
    } else {
      await pool.query('INSERT INTO wants_to_visit (user_id, attraction_id) VALUES ($1, $2)', [userId, attractionId]);
    }
  } catch (error) {
    console.error('Error changing wants_to_visit:', error);
    throw error;
  }
}

exports.getWantsToVisitAttractions = async (userId) => {
  try {
    const { rows } = await pool.query('SELECT attraction_id FROM wants_to_visit WHERE user_id = $1', [userId]);
    return rows.map(row => row.attraction_id);
  } catch (error) {
    console.error('Error fetching wants to visit attractions:', error);
    throw error;
  }
}