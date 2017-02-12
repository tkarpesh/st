let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');
let Article = require('../models/article');

router.get('/sign_up', (req, res) => {
  res.render('users/sign_up');
});

router.get('/login', (req, res) => {
  res.render('users/login');
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
    res.render('users/sign_up', { errors: errors })
  } else {
    let newUser = new User({
      username: username,
      email: email,
      password: password
    });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
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

router.get('/logout', (req, res) => {
  req.logout();

  req.flash('success_msg', 'You are logged out.');

  res.redirect('/users/login');
});

router.get('/:id', (req, res) => {
  let userId = req.params.id;
  let canManage = userId === req.user._id;

  User.getUserById(userId, (err, user) => {
    if (err) throw err;

    if (user) {
      Article.find({userId: user._id}, (err, articles) => {
        if (err) throw err;

        res.render(
          'users/show',
          { user: user, canManage: canManage, articles: articles }
        );
      });
    } else {
      res.redirect('/');
    }
  });
});

router.get('/:user_id/edit', (req, res) => {
  res.render('users/edit', { user: req.user });
});

router.post('/:user_id/update', (req, res) => {
  let username = req.body.username;
  let email = req.body.email;

  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  let errors = req.validationErrors();

  if (errors) {
    res.render('users/edit', { errors: errors })
  } else {
    let newQuery = { username: username, email: email };

    User.updateSingleUser(req.user, newQuery, (err, result) => {
      if (err) throw err;

      result ?
        res.redirect('/users/:user_id') :
        res.sendStatus(500);
    });
  }
});

router.post('/:user_id/delete', (req, res) => {
  User.findOneAndRemove({_id: req.user.id}, (err) => {
    if (err) {
      return res.render('/users/edit', { errors: errors })
    }

    req.flash('success', 'Your account has been deleted.');
    req.logout();
    res.redirect('/users/login');
  });
});

module.exports = router;