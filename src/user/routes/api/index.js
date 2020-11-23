const express = require('express');
const root = require(__dirname + '/../../config').root;

// eslint-disable-next-line new-cap
const router = express.Router();

router.use('/video', require(root + '/routes/api/video'));
router.use(require(root + '/routes/api/info'));

module.exports = router;
