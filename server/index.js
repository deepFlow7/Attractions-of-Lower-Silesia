const express = require('express');
const db = require('../DB/db_api.js');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');


app.use(cors())
app.use(bodyParser.json());

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

app.post('/signup', async (req, res) => {
      const { name, surname, mail, login, password } = req.body;
      try {
            const user_id = await db.new_user(name, surname, mail);
            await db.new_login(user_id, login, password, 'user');
            res.json({ success: true });
      } catch (error) {
            res.json({ success: false, error: error });
      }
})

app.post('/new_attraction', async (req, res) => {
      const { name, coords, type, subtype, interactivity, time_it_takes, description, photos } = req.body;
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

app.listen(8080, () => {
      console.log('server listening on port 8080')
})

