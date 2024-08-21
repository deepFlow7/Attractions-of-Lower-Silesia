const express = require('express');
const db = require('./DB/db_api.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const {Firestore} = require('@google-cloud/firestore');
const {FirestoreStore} = require('@google-cloud/connect-firestore');
const app = express();


const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
var port = normalizePort(process.env.PORT || 8080);


app.use(bodyParser.json());
app.use(cors({
    origin: process.env.ORIGIN_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(session({
    store: new FirestoreStore({
        dataset: new Firestore(),
        kind: 'express-sessions',
    }),
    secret: 'O Great Key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


const greetings = [
    'Hello World',
    'Hallo Welt',
    'Ciao Mondo',
    'Salut le Monde',
    'Hola Mundo',
  ];
  
  app.get('/', (req, res) => {
    if (!req.session.views) {
      req.session.views = 0;
      req.session.greeting =
        greetings[Math.floor(Math.random() * greetings.length)];
    }
    const views = req.session.views++;
    res.send(`${views} views for ${req.session.greeting}`);
  });


//---Logowanie i autoryzacja---
app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await db.check_login(login,password);

        const {user,check} = result;

        if (!check) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        req.session.login=login;
        req.session.role=user.role;
        req.session.user = await db.get_user(user.user_id);
        req.session.blocked = await db.is_user_blocked(user.user_id);
        res.json({authenticated:true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/profile', async (req, res) => {
    
    if (req.session.user) {
        res.json({authenticated : true, blocked : req.session.blocked, user : req.session.user, 
            username: req.session.login, role: req.session.role});
    }
    else{
        res.json({authenticated : false});
    }
});


//---Użytkownicy---
app.get('/users',async (req,res) => {
      try{
            var users = await db.get_users();
            res.json(users);
      }
      catch(error){
            console.log('Error fetching users: '+error);
            res.status(500).json({error: 'Error fetching users:'+error});
      }
})

app.post('/signup', async (req, res) => {
    const { newUser } = req.body;
    const { name, surname, mail, login, password } = newUser;
    try {
          const user_id = await db.new_user(name, surname, mail);
          await db.new_login(user_id, login, password, 'user');
          res.json({ success: true });
    } catch (error) {
          res.json({ success: false, error: error });
    }
})


//---Wyzwania---
app.get('/challenges', async (req,res)=>{
    try{
        var challenges = await db.get_challenges();
        res.json(challenges);
  }
  catch(error){
        console.log('Error fetching challenges: '+error);
        res.status(500).json({error: 'Error fetching challenges:'+error});
  }
})

app.get('/completed_challenges/:user_id', async (req,res)=>{
    try{
        var challenges = await db.get_completed_challenges(req.params["user_id"]);
        res.json(challenges);
  }
  catch(error){
        console.log('Error fetching completed challenges: '+error);
        res.status(500).json({error: 'Error fetching completed challenges:'+error});
  }
})

app.get('/challenge/:id', async (req, res) =>{
    try{
        var challenge = await db.get_challenge(req.params["id"]);
        var attractions = await db.get_challenge_attractions(req.params["id"]);
        res.json({...challenge, attractions: attractions});
    }
    catch(error){
        console.log('Error fetching challenge info: '+error);
        res.status(500).json({error: 'Error fetching challenge info: '+error});
    }
})

app.post('/new_challenge', async (req, res) => {
    const {newChallenge} = req.body;
    const { name, description, coords, zoom, attractions } = newChallenge;
    try {
        const challenge_id = await db.new_challenge(name, description, coords, zoom);
        for (const attraction of attractions) {
            try {
            await db.add_challenge_attraction(challenge_id, attraction.id, attraction.points);
            } catch (error) {
            console.error('Error while adding attraction to challenge:', error);
            }
      }  
      res.json({ success: true });
    } catch (error) {
      console.error('Error while saving challenge:', error);
      res.json({ success: false, error: error.message });
    }
});

app.get('/ranking/:challenge_id', async (req,res) =>{
    try{
        var rankings = await db.get_challenge_ranking(req.params["challenge_id"]);
        res.json(rankings);
    }
    catch(error){
        console.log('Error fetching rankings: '+ error);
        res.status(500).json({error: 'Error fetching rankings: '+error});
    }
})

app.post('/start_challenge/:challenge_id/:user_id', async (req, res) => {
    try {
          await db.start_challenge(req.params['challenge_id'], req.params['user_id']);
          res.json({ success: true });
    } catch (error) {
          res.json({ success: false, error: error });
    }
})

app.get('/takes_part_in_challenge/:challenge_id/:user_id', async (req, res) => {
    try {
          const rows = await db.takes_part_in_challenge(req.params['user_id'], req.params['challenge_id']);
          res.json(rows.length > 0);
    } catch (error) {
          res.status(500).json({ error: error });
    }
})

app.post('/visit_challenge_attraction/:challenge_id/:attraction_id/:user_id', async (req, res) => {
    try {
          await db.visit_challenge_attraction(req.params['user_id'], req.params['challenge_id'], 
            req.params['attraction_id']);
          res.json({ success: true });
    } catch (error) {
          res.json({ success: false, error: error });
    }
})

app.get('/challenge/visited_attractions/:challenge_id/:user_id', async (req, res) => {
    try {
          const rows = await db.get_visited_challenge_attractions(req.params['user_id'], req.params['challenge_id']);
          res.json(rows);
    } catch (error) {
          res.status(500).json({ error: error });
    }
})


//---Atrakcje---
app.get('/attractions', async (req,res) =>{
    try{
        var attractions = await db.get_attractions();
        res.json(attractions);
    }catch(error){
        console.log("Error fetching attractions:"+error);
        res.status(500).json({error:"Error fetching atractions:"+error});
    }
})

app.get('/attraction/:id', async (req,res) =>{
    try{
        var attraction = await db.get_attraction(req.params["id"]);
        var photos = await db.get_photos_by_attraction(req.params["id"]);
        var comments = await db.get_comments_by_attraction(req.params["id"]);
        res.json({attraction:{...attraction,photos},comments:comments});
    }
    catch(error){
        console.error('Error fetching attraction data'+error);
        res.status(500).json({error:'Error fetching attraction data'+error});
    }
})

app.post('/new_attraction', async (req, res) => {
      const { newAttraction } = req.body;
      const { name, coords, type, subtype, interactivity, time_it_takes, description, photos } = newAttraction;
      try {
        const attr_id = await db.new_attraction(name, coords, type, subtype, interactivity, 
            time_it_takes, 0.0, description);
        
        for (const photo of photos) {
          try {
            await db.new_photo(attr_id, photo.photo, photo.caption);
          } catch (error) {
            console.error('Error while saving photo:', error);
          }
        }
        
        res.json({ success: true });
      } catch (error) {
        console.error('Error while saving attraction:', error);
        res.json({ success: false, error: error.message });
      }
});

app.get('/attraction/is_favourite/:attr_id/:user_id', async (req,res) =>{
    try{
        const favourite = await db.isFavourite(req.params["attr_id"], req.params["user_id"]);
        res.json({ favourite: favourite });
    }
    catch(error){
        console.error('Error fetching attraction data'+error);
        res.status(500).json({error:'Error fetching attraction data'+error});
    }
})

app.get('/attraction/is_to_visit/:attr_id/:user_id', async (req,res) =>{
    try{
        const to_visit = await db.isToVisit(req.params["attr_id"], req.params["user_id"]);
        res.json({ to_visit: to_visit });
    }
    catch(error){
        console.error('Error fetching attraction data'+error);
        res.status(500).json({error:'Error fetching attraction data'+error});
    }
})

app.get('/attraction/rating/:attr_id', async (req,res) =>{
    try{
        const rating = await db.get_rating(req.params["attr_id"]);
        res.json({ rating: rating });
    }
    catch(error){
        console.error('Error fetching attraction rating' + error);
        res.status(500).json({error:'Error fetching attraction rating' + error});
    }
})

app.get('/attraction/rating/:attr_id/:user_id', async (req,res) =>{
    try{
        const rating = await db.get_user_rating(req.params["user_id"], req.params["attr_id"]);
        res.json({ rating: rating });
    }
    catch(error){
        console.error('Error fetching user rating for attraction' + error);
        res.status(500).json({error:'Error fetching user rating for attraction' + error});
    }
})

app.post('/changeRating', async (req, res) => {
    const { userId, attractionId, rating } = req.body;
    try {
      await db.add_or_update_rating(userId, attractionId, rating);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/changeFavourites', async (req, res) => {
    const { userId, attractionId } = req.body;
    try {
      await db.changeFavourites(userId, attractionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
app.post('/changeWantsToVisit', async (req, res) => {
    const { userId, attractionId } = req.body;
    try {
        await db.changeWantsToVisit(userId, attractionId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addComment', async (req, res) => {
    const { author, content, votes, attraction, parent } = req.body;
    try {   
      const id = await db.new_comment(author, content, votes, attraction, parent);
      res.json({ success: true, id: id });

    } catch (error) {
      console.error('Error adding new comment:', error);
      res.status(500).json({ error: error.message });
    }
  });

app.post('/attraction/delete', async (req, res) => {
    const { attractionId } = req.body;
    try {
      await db.delete_attraction(attractionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/attraction/update', async (req, res) => {
    const { attractionId, newName } = req.body;
    try {
      await db.changeAttractionName(attractionId, newName);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/challenge/delete', async (req, res) => {
    const { challengeId } = req.body;
    try {
      await db.delete_challenge(challengeId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/challenge/update', async (req, res) => {
    const { challengeId, newName } = req.body;
    try {
      await db.changeChallengeName(challengeId, newName);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/user/block', async (req, res) => {
    const { user_id } = req.body;
    try {
      await db.block_user(user_id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/user/unblock', async (req, res) => {
    const { user_id } = req.body;
    try {
      await db.unblock_user(user_id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/user/is_blocked/:id', async (req, res) => {
    const { user_id } = req.body;
    try {
      const blocked = await db.is_user_blocked(req.params["id"]);
      res.json({ blocked: blocked });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/users/blocked', async (req, res) => {
    try {
      const blocked = await db.get_blocked_users();
      res.json({ blocked_users: blocked });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
      console.log('server listening on port', port)
})

