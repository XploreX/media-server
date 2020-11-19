const express = require('express');
const {StatusCodes} = require('http-status-codes');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/keycodes', (req, res, next) => {
  console.log(req.body);
  res.sendStatus(StatusCodes.OK);
});

module.exports = router;
