var pg = require('pg');
var argon2 = require('argon2');

const pool = new pg.Pool({
  user: process.env.DB_USER || 'pg',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'maps',
  password: process.env.DB_PASS || 'pg',
  port: 5432,
});

class DbApi {
  //------USERS---------
  async signUp(newUser) {
    const { name, surname, mail, login, password } = newUser;
    const client = await pool.connect();
    try {
        client.query('BEGIN')
        const userId = await this.newUser(client, name, surname, mail);
        await this.newLogin(client, userId, login, password, 'user');
        client.query('COMMIT')
    } catch (error) {
        client.query('ROLLBACK')
        throw error;
    } finally {
      client.release();
    }
  }

  async newUser(client, name, surname, mail) {
    try {
      const { rows } = await client.query('INSERT INTO users (name, surname, mail) VALUES ($1, $2, $3) RETURNING id', [name, surname, mail]);
      return rows[0].id;
    } catch (error) {
      console.error('Error creating new user:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const { rows } = await pool.query(`SELECT id, name, surname, mail, login \
                FROM users, logins WHERE users.id=logins.user_id AND role='user'`);
      return rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUser(id) {
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
  }

  async editUser(id, name, surname, mail) {
    try {
      await pool.query('UPDATE users SET name = $1, surname = $2, mail = $3 WHERE id = $4', [name, surname, mail, id]);
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async findUserIdByUsername(username) {
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
  }

  async blockUser(id) {
    try {
      const { rows } = await pool.query('SELECT role FROM logins WHERE user_id = $1', [id]);
      if (rows.role == 'admin')
        throw "Cannot block admin";
      await pool.query('INSERT INTO blocked_users VALUES ($1, NOW())', [id]);
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  async unblockUser(id) {
    try {
      await pool.query('DELETE FROM blocked_users WHERE user_id = $1', [id]);
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  async isUserBlocked(id) {
    try {
      const { rows } = await pool.query('SELECT * FROM blocked_users WHERE user_id = $1', [id]);
      return rows.length > 0;
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
      throw error;
    }
  }

  async getBlockedUsers() {
    try {
      const { rows } = await pool.query('SELECT user_id FROM blocked_users');
      return rows.map(row => row.user_id);
    } catch (error) {
      console.error('Error getting blocked users:', error);
      throw error;
    }
  }

  //------LOGINS---------
  async newLogin(client, userId, login, password, role) {
    try {
      const hash = await argon2.hash(password);
      await client.query('INSERT INTO logins (user_id, login, password, role) VALUES ($1, $2, $3, $4)', [userId, login, hash, role]);
    } catch (error) {
      console.error('Error creating new login:', error);
      throw error;
    }
  }

  async checkLogin(login, password) {
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

  async editLogin(id, login, password) {
    try {
      const hash = await argon2.hash(password);
      await pool.query('UPDATE logins SET login = $1, password = $2 WHERE id = $3', [login, hash, id]);
    } catch (error) {
      console.error("Error updating login data:", error);
      throw error;
    }
  }

  async deleteLogin(id) {
    try {
      await pool.query('DELETE FROM logins WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting login:', error);
      throw error;
    }
  }

  async getLoginById(id) {
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

  //----FAVOURITES-------
  async isFavourite(attractionId, userId) {
    try {
      const result = await pool.query('SELECT * FROM favourites WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error fetching favourites:', error);
      throw error;
    }
  }

  async changeFavourites(userId, attractionId) {
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

  async getFavouriteAttractions(userId) {
    try {
      const { rows } = await pool.query('SELECT attraction_id FROM favourites WHERE user_id = $1', [userId]);
      return rows.map(row => row.attraction_id);
    } catch (error) {
      console.error('Error fetching favourite attractions:', error);
      throw error;
    }
  }

  //---- WANTS TO VISIT -----------
  async isToVisit(attractionId, userId) {
    try {
      const result = await pool.query('SELECT * FROM wants_to_visit WHERE user_id = $1 AND attraction_id = $2', [userId, attractionId]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error fetching attraction to visit :', error);
      throw error;
    }
  }

  async changeWantsToVisit(userId, attractionId) {
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

  async getWantsToVisitAttractions(userId) {
    try {
      const { rows } = await pool.query('SELECT attraction_id FROM wants_to_visit WHERE user_id = $1', [userId]);
      return rows.map(row => row.attraction_id);
    } catch (error) {
      console.error('Error fetching wants to visit attractions:', error);
      throw error;
    }
  }

  //----ATTRACTIONS------
  async newAttraction(name, coords, type, subtype, interactivity, timeItTakes, rating, description) {
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

  async getAttraction(id) {
    try {
      const { rows } = await pool.query('SELECT * FROM attractions WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching attraction:', error);
      throw error;
    }
  }

  async getAttractions() {
    try {
      const { rows } = await pool.query('SELECT * FROM attractions');
      return rows;
    } catch (error) {
      console.error('Error fetching attractions:', error);
      throw error;
    }
  }

  async editAttraction(id, name, coords, type, subtype, interactivity, timeItTakes, rating, description) {
    try {
      await pool.query('UPDATE attractions SET name = $1, coords = $2, type = $3, subtype = $4, interactivity = $5,\
                 time_it_takes = $6, rating = $7, description = $8 WHERE id = $9', 
                 [name, coords, type, subtype, interactivity, timeItTakes, rating, description, id]);
    } catch (error) {
      console.error("Error updating attraction data:", error);
      throw error;
    }
  }

  async changeAttractionName(id, name) {
    try {
      await pool.query('UPDATE attractions SET name = $1 WHERE id = $2', [name, id]);
    } catch (error) {
      console.error("Error updating attraction data:", error);
      throw error;
    }
  }

  async deleteAttraction(id) {
    try {
      await pool.query('DELETE FROM attractions WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting attraction:', error);
      throw error;
    }
  }

  //------RATINGS--------
  async getRating(attractionId) {
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

  async getUserRating(userId, attractionId) {
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

  async addOrUpdateRating(userId, attractionId, rating) {
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

  //------COMMENTS--------
  async newComment(author, content, attraction) {
    try {
      const { rows } = await pool.query('INSERT INTO comments (author, content, attraction) \
                VALUES ($1, $2, $3) RETURNING id',
        [author, content, attraction]);
      return rows[0].id;
    } catch (error) {
      console.error('Error creating new comment:', error);
      throw error;
    }
  }

  async getCommentsByAttraction(attractionId, userId) {
    try {
      const { rows } = await pool.query('SELECT id, logins.login AS author, content, attraction, vote_sum, comment_approvals.approval_status \
         FROM comments JOIN logins ON comments.author = logins.user_id \
         LEFT JOIN comment_approvals ON comment_approvals.comment_id = comments.id AND comment_approvals.voter = $2 \
         WHERE attraction = $1', [attractionId, userId]);
      return rows;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async getCommentsByUser(author) {
    try {
      const { rows } = await pool.query('SELECT * FROM comments WHERE author = $1', [author]);
      return rows;
    } catch (error) {
      console.error('Error fetching comments by user:', error);
      throw error;
    }
  }

  async editComment(id, content) {
    try {
      await pool.query('UPDATE comments SET content = $1 WHERE id = $2', [content, id]);
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }

  async deleteComment(id) {
    try {
      await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async approveComment(commentId, voterId) {
    try {
      await pool.query(`
        INSERT INTO comment_approvals (comment_id, voter, approval_status)
        VALUES ($1, $2, 'approve')
        ON CONFLICT (comment_id, voter)
        DO UPDATE SET approval_status = 'approve'`,
        [commentId, voterId]
      );
    } catch (error) {
      console.error('Error approving comment:', error);
      throw error; 
    }
  }
  
  async disapproveComment(commentId, voterId) {
    try {
      await pool.query(`
        INSERT INTO comment_approvals (comment_id, voter, approval_status)
        VALUES ($1, $2, 'disapprove')
        ON CONFLICT (comment_id, voter)
        DO UPDATE SET approval_status = 'disapprove'`,
        [commentId, voterId]
      );
    } catch (error) {
      console.error('Error disapproving comment:', error);
      throw error;
    }
  }
  
  async removeApproval(commentId, voterId) {
    try {
      await pool.query(`
        DELETE FROM comment_approvals
        WHERE comment_id = $1 AND voter = $2`,
        [commentId, voterId]
      );
    } catch (error) {
      console.error('Error removing approval:', error);
      throw error; 
    }
  }

  //-------PHOTOS---------
  async newPhoto(attractionId, photo, caption) {
    try {
      await pool.query('INSERT INTO photos (attraction_id, photo, caption) VALUES ($1, $2, $3)', 
                [attractionId, photo, caption]);
    } catch (error) {
      console.error('Error adding new photo:', error);
      throw error;
    }
  }

  async getPhoto(id) {
    try {
      const { rows } = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching photo:', error);
      throw error;
    }
  }

  async getPhotosByAttraction(attractionId) {
    try {
      const { rows } = await pool.query('SELECT * FROM photos WHERE attraction_id = $1', [attractionId]);
      return rows;
    } catch (error) {
      console.error('Error fetching photos by attraction:', error);
      throw error;
    }
  }

  async updatePhoto(id, photo, caption) {
    try {
      await pool.query('UPDATE photos SET caption = $1, photo=$2 WHERE id = $3', [caption, photo, id]);
    } catch (error) {
      console.error("Error updating photo:", error);
      throw error;
    }
  }

  async deletePhoto(id) {
    try {
      await pool.query('DELETE FROM photos WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  }

  //------RANKINGS--------
  async getChallengeRanking(challengeId) {
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

  //---CHALLENGES----
  async addChallenge(newChallenge) {
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

  async newChallenge(client, name, description, coords, zoom) {
    try {
      const { rows } = await client.query('INSERT INTO challenges (name, description, coords, zoom) \
            VALUES ($1, $2, POINT($3, $4), $5) RETURNING id', [name, description, coords.x, coords.y, zoom]);
      return rows[0].id;
    } catch (error) {
      console.error('Error adding challenge:', error);
      throw error;
    }
  }

  async getChallenge(challengeId) {
    try {
      const { rows } = await pool.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching challenge info:', error);
      throw error;
    }
  }

  async getChallenges() {
    try {
      const { rows } = await pool.query('SELECT * FROM challenges ', []);
      return rows;
    } catch (error) {
      console.error('Error fetching challenge info:', error);
      throw error;
    }
  }

  async addChallengeAttraction(client, challengeId, attractionId, points) {
    try {
      await client.query('INSERT INTO challenge_attractions (challenge_id, attraction_id, points) \
            VALUES ($1, $2, $3)', [challengeId, attractionId, points]);
    } catch (error) {
      console.error("Error adding challenge attraction:", error);
      throw error;
    }
  }

  async getChallengeAttractions(challengeId) {
    try {
      const { rows } = await pool.query('SELECT * FROM challenge_attractions, attractions \
            WHERE challenge_id = $1 AND challenge_attractions.attraction_id = attractions.id', [challengeId]);
      return rows;
    } catch (error) {
      console.error("Error adding challenge attraction:", error);
      throw error;
    }
  }

  async changeChallengeName(id, name) {
    try {
      await pool.query('UPDATE challenges SET name = $1 WHERE id = $2', [name, id]);
    } catch (error) {
      console.error("Error updating challenge data:", error);
      throw error;
    }
  }

  async deleteChallenge(challengeId) {
    try {
      await pool.query('DELETE FROM challenges WHERE id = $1', [challengeId]);
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw error;
    }
  }

  async deleteChallengeAttraction(challengeId, attractionId) {
    try {
      await pool.query('DELETE FROM challenge_attractions WHERE challenge_id = $1 AND attraction_id = $2', 
                [challengeId, attractionId]);
    } catch (error) {
      console.error('Error deleting challenge attraction:', error);
      throw error;
    }
  }

  async startChallenge(challengeId, userId) {
    try {
      await pool.query('INSERT INTO challenges_started (challenge_id, user_id, start_date) VALUES ($1, $2, NOW())',
        [challengeId, userId]);
    } catch (error) {
      console.error("Error started challenge:", error);
      throw error;
    }
  }

  async finishChallenge(challengeId, userId) {
    try {
      await pool.query('UPDATE challenges_started SET finished_date = NOW() WHERE \
            challenge_id = $1 AND user_id = $2', [challengeId, userId]);
    } catch (error) {
      console.error("Error finishing challenge:", error);
      throw error;
    }
  }

  async takesPartInChallenge(userId, challengeId) {
    try {
      const { rows } = await pool.query('SELECT * FROM challenges_started WHERE \
            challenge_id = $1 AND user_id = $2', [challengeId, userId]);
      return rows;
    } catch (error) {
      console.error("Error checking participation in challenge:", error);
      throw error;
    }
  }

  async visitChallengeAttraction(userId, challengeId, attractionId) {
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
        await this.finish_challenge(challengeId, userId);
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

  async getVisitedChallengeAttractions(userId, challengeId) {
    try {
      const { rows } = await pool.query('SELECT attraction_id FROM visited_challenge_attractions \
                WHERE challenge_id = $1 AND user_id = $2', [challengeId, userId]);
      return rows;
    } catch (error) {
      console.error('Error completing challenge attraction:', error);
      throw error;
    }
  }

  async getCompletedChallenges(userId) {
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

  async getInProgressChallenges(userId) {
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
}

module.exports = new DbApi();
