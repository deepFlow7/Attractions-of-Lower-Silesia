const express = require('express');
const router = express.Router();
const challenges = require('./challenges');
const challengeRoutes = require('../Challenge/challengeRoutes');

router.get('/', challenges.challenges);
router.get('/completed', challenges.completed);
router.get('/inProgress', challenges.inProgress);
router.post('/new', challenges.new);

router.use('/:challengeId', challengeRoutes);

module.exports = router;