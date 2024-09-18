const express = require('express');
const router = express.Router();
const user = require('./credentials');

router.post('/login', user.login);
router.get('/logout', user.logout);
router.post('/signup', user.signup);
router.get('/profile', user.profile);

module.exports = router;