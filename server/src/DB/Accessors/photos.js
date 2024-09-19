const pool = require('../pool');

exports.newPhoto = async (attractionId, photo, caption) => {
  try {
    await pool.query('INSERT INTO photos (attraction_id, photo, caption) VALUES ($1, $2, $3)',
      [attractionId, photo, caption]);
  } catch (error) {
    console.error('Error adding new photo:', error);
    throw error;
  }
}

exports.getPhoto = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw error;
  }
}

exports.getPhotosByAttraction = async (attractionId) => {
  try {
    const { rows } = await pool.query('SELECT * FROM photos WHERE attraction_id = $1', [attractionId]);
    return rows;
  } catch (error) {
    console.error('Error fetching photos by attraction:', error);
    throw error;
  }
}

exports.updatePhoto = async (id, photo, caption) => {
  try {
    await pool.query('UPDATE photos SET caption = $1, photo=$2 WHERE id = $3', [caption, photo, id]);
  } catch (error) {
    console.error("Error updating photo:", error);
    throw error;
  }
}

exports.deletePhoto = async (id) => {
  try {
    await pool.query('DELETE FROM photos WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}