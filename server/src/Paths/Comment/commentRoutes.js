const express = require('express');
const router = express.Router({ mergeParams: true });
const comment = require('./comment');

router.post('/approve', comment.approve);
router.post('/disapprove', comment.disapprove);
router.post('/removeApproval', comment.removeApproval);

module.exports = router;