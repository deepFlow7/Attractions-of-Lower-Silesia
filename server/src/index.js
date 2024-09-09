const express = require('express');
const db = require('./DB/db_api.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { Firestore } = require('@google-cloud/firestore');
const { FirestoreStore } = require('@google-cloud/connect-firestore');
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
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await db.checkLogin(login, password);
        const { user, check } = result;

    if (!check) {
      throw 'Invalid password';
    }
    req.session.login = login;
    req.session.role = user.role;
    req.session.user = await db.getUser(user.user_id);
    req.session.blocked = await db.isUserBlocked(user.user_id);
    res.json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ error: error });
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

app.post('/signup', async (req, res) => {
  const { newUser } = req.body;
  const { name, surname, mail, login, password } = newUser;
  try {
      const userId = await db.newUser(name, surname, mail);
      await db.newLogin(userId, login, password, 'user');
      res.json({ success: true });
  } catch (error) {
      res.json({ success: false, error: error });
  }
});

app.get('/profile', async (req, res) => {
    if (req.session.user) {
        res.json({
            authenticated: true,
            blocked: req.session.blocked,
            user: req.session.user,
            username: req.session.login,
            role: req.session.role
        });
    } else {
        res.json({ authenticated: false });
    }
});

//---USERS---
app.get('/users', async (req, res) => {
    try {
        var users = await db.getUsers();
        res.json(users);
    } catch (error) {
        console.log('Error fetching users: ' + error);
        res.status(500).json({ error: 'Error fetching users:' + error });
    }
});

app.post('/user/block', async (req, res) => {
    const { userId } = req.body;
    try {
        await db.blockUser(userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/user/unblock', async (req, res) => {
    const { userId } = req.body;
    try {
        await db.unblockUser(userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user/is_blocked/:id', async (req, res) => {
    try {
        const blocked = await db.isUserBlocked(req.params["id"]);
        res.json({ blocked: blocked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/blocked', async (req, res) => {
    try {
        const blocked = await db.getBlockedUsers();
        res.json({ blockedUsers: blocked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//---CHALLENGES---
app.get('/challenges', async (req, res) => {
    try {
        var challenges = await db.getChallenges();
        res.json(challenges);
    } catch (error) {
        console.log('Error fetching challenges: ' + error);
        res.status(500).json({ error: 'Error fetching challenges:' + error });
    }
});

app.get('/completed_challenges', async (req, res) => {
  try {
    var challenges = await db.getCompletedChallenges(req.session.user.id);
    res.json(challenges);
  }
  catch (error) {
    console.log('Error fetching completed challenges: ' + error);
    res.status(500).json({ error: 'Error fetching completed challenges:' + error });
  }
})

app.get('/challenge/:id', async (req, res) => {
    try {
        var challenge = await db.getChallenge(req.params["id"]);
        var attractions = await db.getChallengeAttractions(req.params["id"]);
        res.json({ ...challenge, attractions: attractions });
    } catch (error) {
        console.log('Error fetching challenge info: ' + error);
        res.status(500).json({ error: 'Error fetching challenge info: ' + error });
    }
});

app.post('/new_challenge', async (req, res) => {
  const { newChallenge } = req.body;
  const { name, description, coords, zoom, attractions } = newChallenge;
  try {
    const challengeId = await db.newChallenge(name, description, coords, zoom);
    for (const attraction of attractions) {
      try {
        await db.addChallengeAttraction(challengeId, attraction.id, attraction.points);
      } catch (error) {
        let message = 'Error while adding attraction to challenge:' + error;
        console.error(message);
        throw message;
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error while saving challenge:', error);
    res.status(500).json({ success: false, error: error });
  }
});

app.get('/ranking/:challengeId', async (req, res) => {
    try {
        var rankings = await db.getChallengeRanking(req.params["challengeId"]);
        res.json(rankings);
    } catch (error) {
        console.log('Error fetching rankings: ' + error);
        res.status(500).json({ error: 'Error fetching rankings: ' + error });
    }
});

app.post('/start_challenge/:challengeId', async (req, res) => {
  try {
    await db.startChallenge(req.params['challengeId'], req.session.user.id);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error });
  }
})

app.get('/takes_part_in_challenge/:challengeId', async (req, res) => {
  try {
    const rows = await db.takesPartInChallenge(req.session.user.id, req.params['challengeId']);
    res.json(rows.length > 0);
  } catch (error) {
    res.status(500).json({ error: error });
  }
})

app.post('/visit_challenge_attraction/:challengeId/:attractionId', async (req, res) => {
  try {
    await db.visitChallengeAttraction(req.session.user.id, req.params['challengeId'],
      req.params['attractionId']);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error });
  }
})

app.get('/challenge/visited_attractions/:challengeId/', async (req, res) => {
    try {
        const rows = await db.getVisitedChallengeAttractions(req.session.user.id, req.params['challengeId']);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.post('/challenge/delete', async (req, res) => {
    const { challengeId } = req.body;
    try {
        await db.deleteChallenge(challengeId);
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

//---ATTRACTIONS---
app.get('/attractions', async (req, res) => {
    try {
        var attractions = await db.getAttractions();
        res.json(attractions);
    } catch (error) {
        console.log('Error fetching attractions: ' + error);
        res.status(500).json({ error: 'Error fetching attractions: ' + error });
    }
});

app.get('/attraction/:id', async (req, res) => {
    try {
        var attraction = await db.getAttraction(req.params["id"]);
        var photos = await db.getPhotosByAttraction(req.params["id"]);
        var comments = await db.getCommentsByAttraction(req.params["id"]);
        res.json({attraction:{...attraction,photos},comments:comments});
    } catch (error) {
        console.log('Error fetching attraction: ' + error);
        res.status(500).json({ error: 'Error fetching attraction: ' + error });
    }
});

app.post('/new_attraction', async (req, res) => {
    const { newAttraction } = req.body;
    const { name, description, coords } = newAttraction;
    try {
        await db.newAttraction(name, description, coords);
        res.json({ success: true });
    } catch (error) {
        console.error('Error while saving attraction:', error);
        res.json({ success: false, error: error.message });
    }
});

app.get('/attraction/is_favourite/:attrId', async (req, res) => {
  try {
      const favourite = await db.isFavourite(req.params['attrId'], req.session.user.id);
      res.json({ favourite: favourite });
  } catch (error) {
      console.error('Error fetching attraction data: ' + error);
      res.status(500).json({ error: 'Error fetching attraction data: ' + error });
  }
});

app.get('/attraction/is_to_visit/:attrId', async (req, res) => {
  try {
      const to_visit = await db.isToVisit(req.params['attrId'], req.session.user.id);
      res.json({ to_visit: to_visit });
  } catch (error) {
      console.error('Error fetching attraction data: ' + error);
      res.status(500).json({ error: 'Error fetching attraction data: ' + error });
  }
});

app.get('/attraction/rating/:attrId', async (req, res) => {
  try {
      const rating = await db.getRating(req.params['attrId']);
      res.json({ rating: rating });
  } catch (error) {
      console.error('Error fetching attraction rating: ' + error);
      res.status(500).json({ error: 'Error fetching attraction rating: ' + error });
  }
});

app.get('/attraction/rating/:attrId/user', async (req, res) => {
  try {
      const rating = await db.getUserRating(req.session.user.id, req.params['attrId']);
      res.json({ rating: rating });
  } catch (error) {
      console.error('Error fetching user rating for attraction: ' + error);
      res.status(500).json({ error: 'Error fetching user rating for attraction: ' + error });
  }
});

app.post('/changeRating', async (req, res) => {
  const { userId, attractionId, rating } = req.body;
  try {
      await db.addOrUpdateRating(userId, attractionId, rating);
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
      const id = await db.newComment(author, content, votes, attraction, parent);
      res.json({ success: true, id: id });
  } catch (error) {
      console.error('Error adding new comment:', error);
      res.status(500).json({ error: error.message });
  }
});

app.post('/attraction/delete', async (req, res) => {
    const { attractionId } = req.body;
    try {
        await db.deleteAttraction(attractionId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/attraction/update', async (req, res) => {
    const { attractionId, newName, newDescription } = req.body;
    try {
        await db.updateAttraction(attractionId, newName, newDescription);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//---START SERVER---
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
