let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

router.get('/sign_up', (req, res) => {
  res.render('sign_up');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/sign_up', (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let password2 = req.body.password2;

  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('sign_up', { errors: errors })
  } else {
    let newUser = new User({
      username: username,
      email: email,
      password: password
    });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are registered');
    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;

    if (!user) {
      return done(null, false, { message: 'Unknown user' });
    }

    User.comparePasswords(password, user.password, (err, isMatch) => {
      if (err) throw err;

      return isMatch ?
        done(null, user) :
        done(null, false, { message: 'invalid password' });
    })
  })
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  })
});

router.post(
  '/login',
  passport.authenticate(
    'local',
    { successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    }),
    (req, res) => { res.redirect('/'); }
);

module.exports = router;