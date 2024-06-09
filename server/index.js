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
      try{
            const user_id = await db_api.new_user(name, surname, mail);
            await db_api.new_login(user_id, login, password, 'user');
            res.json({ success: true });
      } catch (error) {
            res.json({ success: false, error: error });
      }
})

app.listen(8080, () => {
      console.log('server listening on port 8080')
})

