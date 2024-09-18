const pool = require('../pool');

exports.addChallenge = async (newChallenge) => {
  const { name, description, coords, zoom, attractions } = newChallenge;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const challengeId = await this.newChallenge(client, name, description, coords, zoom);
    for (const attraction of attractions) {
        await this.addChallengeAttraction(client, challengeId, attraction.id, attraction.points);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release(); 
  }
}

exports.newChallenge = async (client, name, description, coords, zoom) => {
  try {
    const { rows } = await client.query('INSERT INTO challenges (name, description, coords, zoom) \
          VALUES ($1, $2, POINT($3, $4), $5) RETURNING id', [name, description, coords.x, coords.y, zoom]);
    return rows[0].id;
  } catch (error) {
    console.error('Error adding challenge:', error);
    throw error;
  }
}

exports.addChallengeAttraction = async (client, challengeId, attractionId, points) => {
  try {
    await client.query('INSERT INTO challenge_attractions (challenge_id, attraction_id, points) \
          VALUES ($1, $2, $3)', [challengeId, attractionId, points]);
  } catch (error) {
    console.error("Error adding challenge attraction:", error);
    throw error;
  }
}

exports.getChallenge = async (challengeId) => {
  try {
    const { rows } = await pool.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching challenge info:', error);
    throw error;
  }
}

exports.getChallenges = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM challenges ', []);
    return rows;
  } catch (error) {
    console.error('Error fetching challenge info:', error);
    throw error;
  }
}


exports.getChallengeAttractions = async (challengeId) => {
  try {
    const { rows } = await pool.query('SELECT * FROM challenge_attractions, attractions \
          WHERE challenge_id = $1 AND challenge_attractions.attraction_id = attractions.id', [challengeId]);
    return rows;
  } catch (error) {
    console.error("Error adding challenge attraction:", error);
    throw error;
  }
}

exports.changeChallengeName = async (id, name) => {
  try {
    await pool.query('UPDATE challenges SET name = $1 WHERE id = $2', [name, id]);
  } catch (error) {
    console.error("Error updating challenge data:", error);
    throw error;
  }
}

exports.deleteChallenge = async (challengeId) => {
  try {
    await pool.query('DELETE FROM challenges WHERE id = $1', [challengeId]);
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
}

exports.deleteChallengeAttraction = async (challengeId, attractionId) => {
  try {
    await pool.query('DELETE FROM challenge_attractions WHERE challenge_id = $1 AND attraction_id = $2', 
              [challengeId, attractionId]);
  } catch (error) {
    console.error('Error deleting challenge attraction:', error);
    throw error;
  }
}

exports.startChallenge = async (challengeId, userId) => {
  try {
    await pool.query('INSERT INTO challenges_started (challenge_id, user_id, start_date) VALUES ($1, $2, NOW())',
      [challengeId, userId]);
  } catch (error) {
    console.error("Error started challenge:", error);
    throw error;
  }
}

exports.finishChallenge = async (challengeId, userId) => {
  try {
    await pool.query('UPDATE challenges_started SET finished_date = NOW() WHERE \
          challenge_id = $1 AND user_id = $2', [challengeId, userId]);
  } catch (error) {
    console.error("Error finishing challenge:", error);
    throw error;
  }
}

exports.takesPartInChallenge = async (userId, challengeId) => {
  try {
    const { rows } = await pool.query('SELECT * FROM challenges_started WHERE \
          challenge_id = $1 AND user_id = $2', [challengeId, userId]);
    return rows;
  } catch (error) {
    console.error("Error checking participation in challenge:", error);
    throw error;
  }
}

exports.visitChallengeAttraction = async (userId, challengeId, attractionId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('SELECT * FROM visited_challenge_attractions \
              WHERE user_id = $1 AND challenge_id = $2 AND attraction_id = $3',
      [userId, challengeId, attractionId]);
    
    if (result.rowCount > 0) {
      await client.query('COMMIT');
      return;
    }

    await client.query('INSERT INTO visited_challenge_attractions VALUES ($1, $2, $3)',
      [challengeId, attractionId, userId]);

    const userRes = await client.query('SELECT points FROM challenges_started \
               WHERE user_id = $1 AND challenge_id = $2', [userId, challengeId]);

    const challengeRes = await client.query('SELECT points FROM challenges \
              WHERE id = $1', [challengeId]);

    const userPoints = userRes.rows[0].points;
    const challengePoints = challengeRes.rows[0].points;

    if (userPoints >= challengePoints) {
      await this.finishChallenge(challengeId, userId);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('Error completing challenge attraction:', error);
    throw error;
  } finally {
    client.release(); 
  }
}

exports.getVisitedChallengeAttractions = async (userId, challengeId) => {
  try {
    const { rows } = await pool.query('SELECT attraction_id FROM visited_challenge_attractions \
              WHERE challenge_id = $1 AND user_id = $2', [challengeId, userId]);
    return rows;
  } catch (error) {
    console.error('Error completing challenge attraction:', error);
    throw error;
  }
}

exports.getCompletedChallenges = async (userId) => {
  try {
    const { rows } = await pool.query('SELECT challenges.id, challenges.name, \
              (challenges_started.points + challenges_started.bonus_points) AS points  \
              FROM challenges, challenges_started \
              WHERE challenges.id = challenges_started.challenge_id \
              AND user_id = $1 AND finished_date IS NOT NULL', [userId]);
    return rows;
  } catch (error) {
    console.error('Error getting completed challenges:', error);
    throw error;
  }
}

exports.getInProgressChallenges = async (userId) => {
  try {
    const { rows } = await pool.query('SELECT challenges.id, challenges.name, \
              (challenges_started.points + challenges_started.bonus_points) AS points  \
              FROM challenges, challenges_started \
              WHERE challenges.id = challenges_started.challenge_id \
              AND user_id = $1 AND finished_date IS NULL', [userId]);
    return rows;
  } catch (error) {
    console.error('Error getting completed challenges:', error);
    throw error;
  }
}