const express = require('express');
const router = express.Router({ mergeParams: true });
const attraction = require('./attraction');

router.get('/', attraction.attraction);
router.get('/isFavourite', attraction.isFavourite);
router.get('/toVisit', attraction.toVisit);
router.get('/rating', attraction.rating);
router.get('/userRating', attraction.userRating);
router.post('/changeRating', attraction.changeRating);
router.post('/changeFavourite', attraction.changeFavourite);
router.post('/changeToVisit', attraction.changeToVisit);
router.post('/delete', attraction.delete);
router.post('/update', attraction.update);

module.exports = router;