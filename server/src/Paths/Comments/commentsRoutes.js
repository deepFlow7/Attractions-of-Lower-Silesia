const express = require('express');
const router = express.Router();
const comments = require('./comments');
const commentRoutes = require('../Comment/commentRoutes');

router.post('/add',comments.add);

router.use('/:commentId',commentRoutes);

module.exports = router;