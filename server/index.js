const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const db_api = require('../DB/db_api');

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.post('/signup', async (req, res) => {
      const { name, surname, mail, login, password } = req.body;
      try {
            const user_id = await db_api.new_user(name, surname, mail);
            await db_api.new_login(user_id, login, password, 'user');
            res.json({ success: true });
      } catch (error) {
            res.json({ success: false, error: error });
      }
})

app.post('/new_attraction', async (req, res) => {
      const { name, coords, type, subtype, interactivity, time_it_takes, description, photos } = req.body;
      try {
        const attr_id = await db_api.new_attraction(name, coords, type, subtype, interactivity, 
            time_it_takes, 0.0, description);
        
        for (const photo of photos) {
          try {
            await db_api.new_photo(attr_id, photo.photo, photo.caption);
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

