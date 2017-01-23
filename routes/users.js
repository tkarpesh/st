let express = require('express');
let router = express.Router();

router.get('/sing_up', (req, res) => {
  res.render('sign_up');
});

router.get('/login', (req, res) => {
  res.render('login');
});


module.exports = router;