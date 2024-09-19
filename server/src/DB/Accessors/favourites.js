const pool = require('../pool');

exports.isFavourite = async (attractionId, userId) => {
    try {
        const result = await pool.query('SELECT * FROM favourites WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error fetching favourites:', error);
        throw error;
    }
}

exports.changeFavourites = async (userId, attractionId) => {
    try {
        const existingEntry = await pool.query('SELECT * FROM favourites WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
        if (existingEntry.rowCount > 0) {
            await pool.query('DELETE FROM favourites WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
        } else {
            await pool.query('INSERT INTO favourites (user_id, attraction_id) VALUES ($1, $2)', [userId, attractionId]);
        }
    } catch (error) {
        console.error('Error changing favourites:', error);
        throw error;
    }
}

exports.getFavouriteAttractions = async (userId) => {
    try {
        const { rows } = await pool.query('SELECT attraction_id FROM favourites WHERE user_id = $1', [userId]);
        return rows.map(row => row.attraction_id);
    } catch (error) {
        console.error('Error fetching favourite attractions:', error);
        throw error;
    }
}
