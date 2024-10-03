const express = require('express');
const router = express.Router({ mergeParams: true });
const user = require('./user');

router.post('/block', user.block);
router.post('/unblock', user.unblock);
router.get('/isBlocked/:id', user.isBlocked);

module.exports = router;