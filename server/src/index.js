const express = require('express');
const db = require('./DB/db_api.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { Firestore } = require('@google-cloud/firestore');
const { FirestoreStore } = require('@google-cloud/connect-firestore');
const app = express();
exports.app = app;
const userRoutes = require('./Paths/Credentials/credentialsRoutes.js');
const usersRoutes = require('./Paths/Users/usersRoutes.js');
const challengesRoutes = require('./Paths/Challenges/challengesRoutes');
const attractionsRoutes = require('./Paths/Attractions/attractionsRoutes');
const commentsRoutes = require('./Paths/Comments/commentsRoutes');

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
    httpOnly: true,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        maxAge: 5000*60,
        sameSite: 'none'
    }
}));
app.set('trust proxy',1);


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

//---LOGINS AND AUTENTICATION---
app.use('/user', userRoutes);

//---USERS---
app.use('/users', usersRoutes);

//---CHALLENGES---
app.use('/challenges', challengesRoutes);

//---ATTRACTIONS---
app.use('/attractions', attractionsRoutes);

//---COMMENTS---
app.use('/comments', commentsRoutes);

//---START SERVER---
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
