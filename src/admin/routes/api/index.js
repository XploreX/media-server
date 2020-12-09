const config = global.__config;

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.use(
    '/user-server',
    require(config.root + '/src/admin/routes/api/user-server'),
);

router.use(require(config.root + '/src/admin/routes/api/settings'));
router.use(require(config.root + '/src/admin/routes/api/logs'));
module.exports = router;
