let express = require('express');
let router = express.Router();

let User = require('../models/user');
let Article = require('../models/article');

router.get('/new', (req, res) => {
  res.render('articles/new');
});

module.exports = router;