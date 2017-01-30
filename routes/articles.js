let express = require('express');
let router = express.Router();

let User = require('../models/user');
let Article = require('../models/article');

router.get('/new', (req, res) => {
  let user = User.getUserById(req.userId, () => {});

  res.render('articles/new', { user: user });
});

module.exports = router;