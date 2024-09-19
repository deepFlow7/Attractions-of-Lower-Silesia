const pool = require('../pool');

exports.newAttraction = async (name, coords, type, subtype, interactivity, timeItTakes, rating, description) => {
  try {
    const { rows } = await pool.query('INSERT INTO attractions (name, coords, type, subtype,\
              interactivity, time_it_takes, rating, description) \
              VALUES ($1, POINT($2, $3), $4, $5, $6, $7, $8, $9) RETURNING id',
      [name, coords.x, coords.y, type, subtype, interactivity, timeItTakes, rating, description]);
    return rows[0].id;
  } catch (error) {
    console.error('Error creating new attraction:', error);
    throw error;
  }
}

exports.getAttraction = async (id) => {
  try {
    const { rows } = await pool.query('SELECT * FROM attractions WHERE id = $1', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching attraction:', error);
    throw error;
  }
}

exports.getAttractions = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM attractions');
    return rows;
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

exports.editAttraction = async (id, name, coords, type, subtype, interactivity, timeItTakes, rating, description) => {
  try {
    await pool.query('UPDATE attractions SET name = $1, coords = $2, type = $3, subtype = $4, interactivity = $5,\
               time_it_takes = $6, rating = $7, description = $8 WHERE id = $9',
      [name, coords, type, subtype, interactivity, timeItTakes, rating, description, id]);
  } catch (error) {
    console.error("Error updating attraction data:", error);
    throw error;
  }
}

exports.changeAttractionName = async (id, name) => {
  try {
    await pool.query('UPDATE attractions SET name = $1 WHERE id = $2', [name, id]);
  } catch (error) {
    console.error("Error updating attraction data:", error);
    throw error;
  }
}

exports.deleteAttraction = async (id) => {
  try {
    await pool.query('DELETE FROM attractions WHERE id = $1', [id]);
  } catch (error) {
    console.error('Error deleting attraction:', error);
    throw error;
  }
}