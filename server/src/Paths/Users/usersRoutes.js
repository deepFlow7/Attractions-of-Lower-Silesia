const express = require('express');
const router = express.Router();
const users = require('./users');
const userRoutes = require('../User/userRoutes');

router.get('/', users.users);
router.get('/blocked', users.blocked);

router.use('/:userId', userRoutes);

module.exports = router;