let express = require('express');
let router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');

router.get('/new', (req, res) => {
  res.render('articles/new', { user: req.user });
});

router.get('/', (req, res) => {
  Article.find((err, docs) => {
    if (err) throw err;

    res.render('articles/index', { articles: docs })
  });
});

router.get('/:id', (req, res) => {
  let articleId = req.params.id;

  Article.findById(articleId, (err, article) => {
    if (err) { return res.redirect('articles/'); }

    User.findById(article.userId, (err, user) => {
      if (err) { return res.redirect('articles/'); }

      res.render('articles/show', { article: article, user: user });
    });
  });
});

router.post('/create', (req, res) => {
  let title = req.body.title;
  let content = req.body.content;
  let userId = req.body.userId;

  req.checkBody('title', 'Title is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render('articles/new', { user: req.user, errors: errors });
  } else {
    let newAritcle = new Article({
      title: title,
      content: content,
      userId: userId
    });

    Article.createArticle(newAritcle, (err, article) => {
      if (err) throw err;
    });

    req.flash('success_msg', 'You are registered');
    res.redirect('/');
  }
});

module.exports = router;