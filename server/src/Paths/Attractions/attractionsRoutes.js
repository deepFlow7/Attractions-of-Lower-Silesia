const express = require('express');
const router = express.Router();
const attractions = require('./attractions');
const attractionRoutes = require('../Attraction/attractionRoutes');

router.get('/', attractions.attractions);
router.post('/new', attractions.new);
router.get('/favourites', attractions.favourites);
router.get('/toVisit', attractions.toVisit);

router.use('/:attractionId', attractionRoutes);

module.exports = router;