const express = require('express');
const db = require('../DB/db_api.js');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors({
    //origin: 'http://localhost:5173',
    credentials: true
}));
app.use(session({
    secret: 'O Great Key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await db.check_login(login,password);

        const {user,check} = result;

        if (!check) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        req.session.userId = user.user_id;
        req.session.role = user.role
        res.json({ message: 'Logged in successfully' });
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
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await db.get_user(req.session.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

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

app.get('/challenge/:id', async (req, res) =>{
    try{
        var {challenge,attractions} = await db.get_challenge(req.params["id"]);
        var attr_info = await Promise.all(attractions.map(async id => await db.get_attraction(id)));
        res.json({...challenge,attractions:attr_info});
    }
    catch(error){
        console.log('Error fetching challenge info: '+error);
        res.status(500).json({error: 'Error fetching challenge info: '+error});
    }
})

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

app.get('/attractions', async (req,res) =>{
    try{
        var attractions = await db.get_attractions();
        res.json(attractions);
    }catch(error){
        console.log("Error fetching attractions:"+error);
        res.status(500).json({error:"Error fetching atractions:"+error});
    }
})

app.get('/rankings', async (req,res) =>{
    try{
        var rankings = await db.get_rankings();
        res.json(rankings);
    }
    catch(error){
        console.log('Error fetching rankings: '+ error);
        res.status(500).json({error: 'Error fetching rankings: '+error});
    }
})









app.listen(8080, () => {
      console.log('server listening on port 8080')
})

