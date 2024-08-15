var pg = require('pg');
var argon2 = require('argon2');

const pool = new pg.Pool({
    user: process.env.DB_USER || 'pg',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'maps',
    password: process.env.DB_PASS || 'pg',
    port: 5432,
  });

class db_api {
    //------USERS---------
    async new_user(name, surname, mail) {
        try {
            const { rows } = await pool.query('INSERT INTO users (name, surname, mail) VALUES ($1, $2, $3) RETURNING id', [name, surname, mail]);
            return rows[0].id;
        } catch (error) {
            console.error('Error creating new user:', error);
            throw error;
        }
    }

    async get_users() {
        try {
            const { rows } = await pool.query(`SELECT name, surname, mail, login \
                FROM users, logins WHERE users.id=logins.user_id AND role='user'`);
            return rows;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async get_user(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE id=$1',[id]);
            if(rows.length<=0){
                throw "User not found";
            }
            return rows[0];
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async edit_user(id, name, surname, mail) {
        try {
            await pool.query('UPDATE users SET name = $1, surname = $2, mail = $3 WHERE id = $4', [name, surname, mail, id]);
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
    }

    async delete_user(id) {
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
    

    //------LOGINS---------
    async new_login(user_id, login, password, role) {
        try {
            const hash = await argon2.hash(password);
            await pool.query('INSERT INTO logins (user_id, login, password, role) VALUES ($1, $2, $3, $4)', [user_id, login, hash, role]);
        } catch (error) {
            console.error('Error creating new login:', error);
            throw error;
        }
    }

    async check_login(login,password){
        try{
            const {rows} = await pool.query('SELECT * FROM logins WHERE login=$1',[login]);
            if (rows.length<=0){
                throw "User with this login does not exist: "+login;
            }
            const user_hash=rows[0].password;
            var check=await argon2.verify(user_hash,password);
            return {user:rows[0], check:check};
        }
        catch (error){
            console.error("Error checking password:",error);
            throw error;
        }
    }

    async edit_login(id, login, password) {
        try {
            const hash = await argon2.hash(password);
            await pool.query('UPDATE logins SET login = $1, password = $2 WHERE id = $3', [login, hash, id]);
        } catch (error) {
            console.error("Error updating login data:", error);
            throw error;
        }
    }

    async delete_login(id) {
        try {
            await pool.query('DELETE FROM logins WHERE id = $1', [id]);
        } catch (error) {
            console.error('Error deleting login:', error);
            throw error;
        }
    }

    async get_login_by_id(id) {
        try {
            const { rows } = await pool.query('SELECT login FROM logins WHERE user_id=$1',[id]);
            if(rows.length<=0){
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

    //----ATTRACTIONS------
    async new_attraction(name, coords, type, subtype, interactivity, time_it_takes, rating, description) {
        try {
            const {rows} = await pool.query('INSERT INTO attractions (name, coords, type, subtype,\
                interactivity, time_it_takes, rating, description) \
                VALUES ($1, POINT($2, $3), $4, $5, $6, $7, $8, $9) RETURNING id', 
            [name, coords.x, coords.y, type, subtype, interactivity, time_it_takes, rating, description]);
            return rows[0].id;
        } catch (error) {
            console.error('Error creating new attraction:', error);
            throw error;
        }
    }

    async get_attraction(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM attractions WHERE id = $1', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching attraction:', error);
            throw error;
        }
    }

    async get_attractions() {
        try {
            const { rows } = await pool.query('SELECT * FROM attractions');
            return rows;
        } catch (error) {
            console.error('Error fetching attractions:', error);
            throw error;
        }
    }

    async edit_attraction(id, name, coords, type, subtype, interactivity, time_it_takes, rating, description) {
        try {
            await pool.query('UPDATE attractions SET name = $1, coords = $2, type = $3, subtype = $4, interactivity = $5, time_it_takes = $6, rating = $7, description = $8 WHERE id = $9', [name, coords, type, subtype, interactivity, time_it_takes, rating, description, id]);
        } catch (error) {
            console.error("Error updating attraction data:", error);
            throw error;
        }
    }

    async delete_attraction(id) {
        try {
            await pool.query('DELETE FROM attractions WHERE id = $1', [id]);
        } catch (error) {
            console.error('Error deleting attraction:', error);
            throw error;
        }
    }

    //------COMMENTS--------
    async new_comment(author, content, votes, attraction, parent) {
        try {

            const {rows} = await pool.query('INSERT INTO comments (author, content, votes, attraction, parent) \
                VALUES ($1, $2, $3, $4, $5) RETURNING id', 
                [author, content, votes, attraction, parent]);
            return rows[0].id;
           
        } catch (error) {
            console.error('Error creating new comment:', error);
            throw error;
        }
    }
    

    async get_comment(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching comment:', error);
            throw error;
        }
    }

    async get_comments_by_attraction(attr_id){
        try{
            const {rows} = await pool.query('SELECT * FROM comments WHERE attraction = $1',[attr_id]);
            return rows;
        }
        catch(error){
            console.error('Error fetching comments:'+error);
            throw error;
        }
        
    }

    async get_comments_by_user(author) {
        try {
            const { rows } = await pool.query('SELECT * FROM comments WHERE author = $1', [author]);
            return rows;
        } catch (error) {
            console.error('Error fetching comments by user:', error);
            throw error;
        }
    }

    async edit_comment(id, content) {
        try {
            await pool.query('UPDATE comments SET content = $1 WHERE id = $2', [content, id]);
        } catch (error) {
            console.error("Error updating comment:", error);
            throw error;
        }
    }

    async delete_comment(id) {
        try {
            await pool.query('DELETE FROM comments WHERE id = $1', [id]);
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }

    //-------PHOTOS---------
    async new_photo(attraction_id, photo, caption) {
        try {
            await pool.query('INSERT INTO photos (attraction_id, photo, caption) VALUES ($1, $2, $3)', [attraction_id, photo, caption]);
        } catch (error) {
            console.error('Error adding new photo:', error);
            throw error;
        }
    }

    async get_photo(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM photos WHERE id = $1', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching photo:', error);
            throw error;
        }
    }

    async get_photos_by_attraction(attraction_id) {
        try {
            const { rows } = await pool.query('SELECT * FROM photos WHERE attraction_id = $1', [attraction_id]);
            return rows;
        } catch (error) {
            console.error('Error fetching photos by attraction:', error);
            throw error;
        }
    }

    async update_photo(id, photo, caption) {
        try {
            await pool.query('UPDATE photos SET caption = $1, photo=$2 WHERE id = $3', [caption, photo, id]);
        } catch (error) {
            console.error("Error updating photo:", error);
            throw error;
        }
    }

    async delete_photo(id) {
        try {
            await pool.query('DELETE FROM photos WHERE id = $1', [id]);
        } catch (error) {
            console.error('Error deleting photo:', error);
            throw error;
        }
    }

    //------RANKINGS--------
    async get_challenge_ranking(challenge_id){
        try {
            const { rows } = await pool.query(
                'SELECT logins.login, (challenges_started.points + challenges_started.bonus_points) AS score \
                FROM challenges_started JOIN logins ON logins.user_id = challenges_started.user_id \
                WHERE challenge_id = $1 ORDER BY score DESC', 
            [challenge_id]);
            return rows;
        } catch (error) {
            console.error('Error fetching ranking:', error);
            throw error;
        }
    }

    //---Challenges----
    async new_challenge(name, description, coords, zoom) {
        try {
            const {rows} = await pool.query('INSERT INTO challenges (name, description, coords, zoom) \
            VALUES ($1, $2, POINT($3, $4), $5) RETURNING id', [name, description, coords.x, coords.y, zoom]);
            return rows[0].id;
        } catch (error) {
            console.error('Error adding challenge:', error);
            throw error;
        }
    }

    async get_challenge(challenge_id) {
        try {
            const { rows } = await pool.query('SELECT * FROM challenges WHERE id = $1', [challenge_id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching challenge info:', error);
            throw error;
        }
    }

    async get_challenges(){
        try {
            const { rows } = await pool.query('SELECT * FROM challenges ', []);
            return rows;
        } catch (error) {
            console.error('Error fetching challenge info:', error);
            throw error;
        }
    }

    async add_challenge_attraction(challenge_id, attraction_id, points) {
        try {
            await pool.query('INSERT INTO challenge_attractions (challenge_id, attraction_id, points) \
            VALUES ($1, $2, $3)', [challenge_id, attraction_id, points]);
        } catch (error) {
            console.error("Error adding challenge attraction:", error);
            throw error;
        }
    }

    async get_challenge_attractions(challenge_id) {
        try {
            const {rows} = await pool.query('SELECT * FROM challenge_attractions, attractions \
            WHERE challenge_id = $1 AND challenge_attractions.attraction_id = attractions.id', [challenge_id]);
            return rows;
        } catch (error) {
            console.error("Error adding challenge attraction:", error);
            throw error;
        }
    }

    async delete_challenge(challenge_id) {
        try {
            await pool.query('DELETE FROM challenges WHERE id = $1', [challenge_id]);
        } catch (error) {
            console.error('Error deleting challenge:', error);
            throw error;
        }
    }

    async delete_challenge_attraction(challenge_id, attraction_id) {
        try {
            await pool.query('DELETE FROM challenge_attractions WHERE challenge_id = $1 AND attraction_id = $2', [challenge_id, attraction_id]);
        } catch (error) {
            console.error('Error deleting challenge attraction:', error);
            throw error;
        }
    }

    async start_challenge(challenge_id, user_id){
        try {
            await pool.query('INSERT INTO challenges_started (challenge_id, user_id, start_date) VALUES ($1, $2, NOW())', 
            [challenge_id, user_id]);
        } catch (error) {
            console.error("Error started challenge:", error);
            throw error;
        }
    }

    async finish_challenge(challenge_id,user_id){
        try {
            await pool.query('UPDATE challenges_started SET finished_date = NOW() WHERE \
            challenge_id = $1 AND user_id = $2', [challenge_id, user_id]);
        } catch (error) {
            console.error("Error finishing challenge:", error);
            throw error;
        }
    }

    async takes_part_in_challenge(user_id, challenge_id){
        try {
            const {rows} = await pool.query('SELECT * FROM challenges_started WHERE \
            challenge_id = $1 AND user_id = $2', [challenge_id, user_id]);
            return rows;
        } catch (error) {
            console.error("Error checking participation in challenge:", error);
            throw error;
        }
    }

    async visit_challenge_attraction(user_id, challenge_id, attraction_id) {
        try {
            const result = await pool.query('SELECT * FROM visited_challenge_attractions \
                WHERE user_id = $1 AND challenge_id = $2 AND attraction_id = $3', 
            [user_id, challenge_id, attraction_id]);
            
            console.log(result);
            if (result.rowCount > 0)
                return;
    
            
            await pool.query('INSERT INTO visited_challenge_attractions VALUES ($1, $2, $3)', 
            [challenge_id, attraction_id, user_id]);
            const user_res = await pool.query('SELECT points FROM challenges_started \
                 WHERE user_id = $1 AND challenge_id = $2', [user_id, challenge_id]);
            const challenge_res = await pool.query('SELECT points FROM challenges \
                WHERE id = $1', [challenge_id]);
            const user_points = user_res.rows[0].points;
            const challenge_points = challenge_res.rows[0].points;

            if(user_points >= challenge_points)
                await this.finish_challenge(challenge_id, user_id);
        } catch (error) {
            console.error('Error completing challenge attraction:', error);
            throw error;
        }
    }

    async get_visited_challenge_attractions(user_id, challenge_id) {
        try {
            const {rows} = await pool.query('SELECT attraction_id FROM visited_challenge_attractions \
                WHERE challenge_id = $1 AND user_id = $2', [challenge_id, user_id]);
            return rows;
        } catch (error) {
            console.error('Error completing challenge attraction:', error);
            throw error;
        }
    }

    async get_completed_challenges(user_id) {
        try {
            const {rows} = await pool.query('SELECT challenges.id, challenges.name, \
                (challenges_started.points + challenges_started.bonus_points) AS points  \
                FROM challenges, challenges_started \
                WHERE challenges.id = challenges_started.challenge_id \
                AND user_id = $1 AND finished_date IS NOT NULL', [user_id]);
            return rows;
        } catch (error) {
            console.error('Error getting completed challenges:', error);
            throw error;
        }
    }
}

module.exports = new db_api();
