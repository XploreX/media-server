const config = global.__config;

const express = require('express');

const root = config.root;

// eslint-disable-next-line new-cap
const router = express.Router();

router.use('/video', require(root + '/src/user/routes/api/video'));
router.use(require(root + '/src/user/routes/api/info'));

module.exports = router;
