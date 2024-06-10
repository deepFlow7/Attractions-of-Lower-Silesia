const { error } = require('console');
var pg = require('pg');
var bcrypt = require('bcrypt');

var pool = new pg.Pool({
    host: 'localhost',
    database: 'maps',
    user: 'pg',
    password: 'pg'
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
            const { rows } = await pool.query('SELECT * FROM users');
            return rows;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async get_user_id(login) {
        try {
            const { rows } = await pool.query('SELECT id FROM logins WHERE login = $1', [login]);
            if (rows.length <= 0) {
                throw "User does not exist: " + login;
            }
            return rows[0].id;
        } catch (error) {
            console.error('Error getting user ID:', error);
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
    //------LOGINS---------
    async new_login(user_id, login, password, role) {
        try {
            const hash = await bcrypt.hash(password, 12);
            await pool.query('INSERT INTO logins (user_id, login, password, role) VALUES ($1, $2, $3, $4)', [user_id, login, hash, role]);
        } catch (error) {
            console.error('Error creating new login:', error);
            throw error;
        }
    }

    async edit_login(id, login, password) {
        try {
            const hash = await bcrypt.hash(password, 12);
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

    //----FAVOURITES-------
    async change_favourite(user_id,attr_id,fav){
        try {
            await pool.query('INSERT INTO favourites (user_id, attraction_id, favourite) VALUES ($1,$2,$3) \
                                ON CONFLICT UPDATE favourites SET favourite = $3 WHERE user_id=$1 attraction_id=$2'[user_id,attr_id,fav]);
        } catch (error){
            console.error('Error setting favourite: ', error);
            throw error;
        }
    }
    async add_to_favourites(user_id, attr_id) {
        try { 
            await this.change_favourite(user_id,attr_id,true);
        } catch (error){
            throw error;
        }
    }

    async remove_from_favourites(user_id,attr_id){
        try{
            await this.change_favourite(user_id,attr_id,false);
        } catch(error){
            throw error;
        }
    }

    async set_thoughts(user_id, attr_id, thought){
        try {
            await pool.query('INSERT INTO favourites (user_id, attraction_id, interest) VALUES ($1,$2,$3) \
                                ON CONFLICT UPDATE favourites SET interest = $3 WHERE user_id=$1 attraction_id=$2'[user_id,attr_id,thought]);
        } catch (error){
            console.error('Error setting thought: ', error);
            throw error;
        }
    }

    //----ATTRACTIONS------
    async new_attraction(name, coords, type, subtype, interactivity, time_it_takes, rating, description) {
        try {
            await pool.query('INSERT INTO attractions (name, coords, type, subtype, interactivity, time_it_takes, rating, description) VALUES ($1, POINT($2, $3), $4, $5, $6, $7, $8, $9)', [name, coords.x, coords.y, type, subtype, interactivity, time_it_takes, rating, description]);
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
            await pool.query('INSERT INTO comments (author, content, votes, attraction, parent) VALUES ($1, $2, $3, $4, $5)', [author, content, votes, attraction, parent]);
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
    async get_user_ranking(user_id) {
        try {
            const { rows } = await pool.query('SELECT * FROM rankings WHERE user_id = $1', [user_id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching user ranking:', error);
            throw error;
        }
    }

    async get_rankings(){
        try {
            const { rows } = await pool.query('SELECT * FROM rankings', []);
            return rows;
        } catch (error) {
            console.error('Error fetching rankings:', error);
            throw error;
        }
    }

    //---Challenges----
    async add_challenge(name,description,points,attractions) {
        try {
            const id = await pool.query('INSERT INTO challenges (name, description, points) VALUES ($1, $2, $3) RETURNING id', [name, description, points]);
            for(attraction in attractions){
                await pool.query('INSERT INTO challenge_attractions (challenge_id, attraction_id) VALUES ($1, $2)',[id,attraction]);
            }
        } catch (error) {
            console.error('Error adding challenge:', error);
            throw error;
        }
    }

    async get_challenge(challenge_id) {
        try {
            const { rows } = await pool.query('SELECT * FROM challenges WHERE id = $1', [challenge_id]);
            const { rows: attractions } = await pool.query('SELECT attraction_id FROM challenge_attractions WHERE challenge_id = $1', [challenge_id]);
            return { challenge: rows[0], attractions: attractions.map(attr => attr.attraction_id)};
        } catch (error) {
            console.error('Error fetching challenge info:', error);
            throw error;
        }
    }
    //TODO Przemyśleć
    async get_challenges(){
        try {
            const { rows } = await pool.query('SELECT * FROM challenges ', []);
            return rows;
        } catch (error) {
            console.error('Error fetching challenge info:', error);
            throw error;
        }
    }

    async edit_challenge(challenge_id, name, description, points) {
        try {
            await pool.query('UPDATE challenges SET name = $1, description = $2, points = $3 WHERE id = $4', [name, description, points, challenge_id]);
        } catch (error) {
            console.error("Error updating challenge:", error);
            throw error;
        }
    }

    async add_challenge_attraction(challenge_id, attraction_id) {
        try {
            await pool.query('INSERT INTO challenge_attractions (challenge_id, attraction_id) VALUES ($1, $2)', [challenge_id, attraction_id]);
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

    async finish_challenge(challenge_id,user_id){
        try {
            await pool.query('INSERT INTO challenges_finished (challenge_id, user_id) VALUES ($1, $2)', [challenge_id, user_id]);
        } catch (error) {
            console.error("Error finishing challenge:", error);
            throw error;
        }
    }
}

module.exports = new db_api();
