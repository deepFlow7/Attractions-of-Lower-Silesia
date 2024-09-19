const pool = require('../pool');

exports.getRating = async (attractionId) => {
    try {
        const { rows } = await pool.query('SELECT rating FROM attractions \
               WHERE id = $1',
            [attractionId]);
        return rows[0].rating;
    } catch (error) {
        console.error('Error fetching rating:', error);
        throw error;
    }
}

exports.getUserRating = async (userId, attractionId) => {
    try {
        const { rows } = await pool.query('SELECT rating FROM ratings \
               WHERE user_id = $1 AND attraction_id = $2',
            [userId, attractionId]);
        if (rows.length)
            return rows[0].rating;
        return 0;
    } catch (error) {
        console.error('Error fetching user rating:', error);
        throw error;
    }
}

exports.addOrUpdateRating = async (userId, attractionId, rating) => {
    try {
        if (await this.getUserRating(userId, attractionId)) {
            await pool.query('UPDATE ratings SET rating = $3 \
                  WHERE user_id = $1 AND attraction_id = $2',
                [userId, attractionId, rating]);
        }
        else {
            await pool.query('INSERT INTO ratings VALUES ($1, $2, $3)',
                [userId, attractionId, rating]);
        }
    } catch (error) {
        console.error('Error updating rating:', error);
        throw error;
    }
}