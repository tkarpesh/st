let express = require('express');
let router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');
let Grade = require('../models/grade');

router.get('/new', (req, res) => {
  res.render('articles/new', { user: req.user });
});

router.get('/', (req, res) => {
  Article.find((err, docs) => {
    if (err) throw err;

    res.render('articles/index', { articles: docs, user: req.user })
  });
});

router.get('/:id', (req, res) => {
  let articleId = req.params.id;

  Article.findById(articleId, (err, article) => {
    if (err) { return res.redirect('articles/'); }

    User.findById(article.userId, (err, user) => {
      let [username, canManipulate] =
        user ? [user.username, true] : ['DELETED', false];

      Grade.find({articleId: articleId}, (err, grades) => {
        if (err) throw err;

        let gradesSum = 0;
        grades.forEach(grade => { gradesSum += grade });

        let rating = gradesSum / grades.length || 0;

        res.render(
          'articles/show',
          { article: article,
            canManipulate: canManipulate,
            creatorName: username,
            user: req.user,
            rating: rating
          }
        );
      });
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

router.get('/:id/edit', (req, res) => {
  let articleId = req.params.id;

  Article.findById(articleId, (err, article) => {
    if (err) { return res.redirect('articles/'); }

    res.render('articles/edit', { article: article });
  });
});

router.post('/:id/update', (req, res) => {
  let title = req.body.title;
  let content = req.body.content;

  req.checkBody('title', 'Title is required').notEmpty();
  let errors = req.validationErrors();

  let articleId = req.params.id;

  if (errors) {
    res.render('articles/edit', { errors: errors })
  } else {
    let newQuery = { title: title, content: content };

    Article.updateArticle(articleId, newQuery, (err, result) => {
      if (err) throw err;

      result ?
        res.redirect(`/articles/${articleId}`) :
        res.sendStatus(500);
    });
  }
});

router.post('/:id/delete', (req, res) => {
  Article.findOneAndRemove({_id: req.params.id}, (err) => {
    if (err) {
      return res.render(`/articles/${req.params.id}`, { errors: errors })
    }

    req.flash('success', 'Article has been deleted.');
    res.redirect('/articles/');
  });
});

router.post('/:id/updateGrade', (req, res) => {
  let [userId, articleId] = [req.user.id, req.params.id];

  Grade.find(
    {articleId: articleId, userId: userId}, (err, grade) => {
      if (grade.length === 0) {
        let newGrade = new Grade({
          userId: userId,
          articleId: articleId,
          mark: 5
        });

        Grade.createGrade(newGrade, (err, grade) => {
          if (err) throw err;
        });

        req.flash('success_msg', 'Thanks for your grading');
      }

      res.redirect(`/articles/${req.params.id}`);
    })
});

module.exports = router;