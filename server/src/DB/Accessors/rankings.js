const pool = require('../pool');

exports.getChallengeRanking = async (challengeId) => {
    try {
        const { rows } = await pool.query(
            'SELECT logins.login, (challenges_started.points + challenges_started.bonus_points) AS score \
              FROM challenges_started JOIN logins ON logins.user_id = challenges_started.user_id \
              WHERE challenge_id = $1 ORDER BY score DESC',
            [challengeId]);
        return rows;
    } catch (error) {
        console.error('Error fetching ranking:', error);
        throw error;
    }
}