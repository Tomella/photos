const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('It really works!');
});

module.exports = router;
