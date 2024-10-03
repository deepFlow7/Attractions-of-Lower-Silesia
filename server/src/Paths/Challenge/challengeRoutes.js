const express = require('express');
const router = express.Router({ mergeParams: true });
const challenge = require('./challenge');

router.get('/', challenge.info);
router.get('/ranking', challenge.ranking);
router.post('/start', challenge.start);
router.get('/userParticipates', challenge.userParticipates);
router.post('/visit/:attractionId', challenge.visit);
router.get('/visited', challenge.visited);
router.post('/delete', challenge.delete);
router.post('/update', challenge.update);

module.exports = router;