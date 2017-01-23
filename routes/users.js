let express = require('express');
let router = express.Router();

router.get('/sign_up', (req, res) => {
  res.render('sign_up');
});

router.get('/login', (req, res) => {
  res.render('login');
});


module.exports = router;