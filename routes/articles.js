let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Article = mongoose.model('Article');
let User = mongoose.model('User');
let Grade = mongoose.model('Grade');
let Comment = mongoose.model('Comment');

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
  let currentUserId = req.user.id;

  Article.findById(articleId, (err, article) => {
    if (err) { return res.redirect('articles/'); }

    User.findById(article.userId, (err, user) => {
      let [creator, canManipulate] =
        user ?
          user.id === currentUserId ?
            [req.user, true]:
            [user, false] :
          [null, false];

      Grade.find({articleId: articleId}, (err, grades) => {
        if (err) throw err;

        let gradesSum = 0;
        let currentUserGrade;

        grades.forEach(grade => { gradesSum += grade.mark });

        currentUserGrade = grades.find(grade => { return grade.userId === currentUserId });

        let rating = gradesSum / grades.length || 0;

        Comment.find({ articleId: articleId }, (err, comments) => {
          if (err) throw err;

          let newComments = [];

          comments.forEach(comment => {
            User.findById(comment.userId, (err, user) => {
              newComments.push({comment: comment, commenter: user});
            })
          });

          res.render(
            'articles/show',
            { article: article,
              canManipulate: canManipulate,
              creator: creator,
              user: req.user,
              rating: rating,
              currentUserMark: currentUserGrade ? currentUserGrade.mark : null,
              comments: newComments
            }
          );
        });
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

    newAritcle.save((err, article) => { if (err) throw err });

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

    Article.update(articleId, newQuery, (err, result) => {
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

router.get('/:id/updateGrade/:mark', (req, res) => {
  let [userId, articleId, mark] = [req.user.id, req.params.id, req.params.mark];

  (mark > 0 && mark < 6) ?
    Grade.find(
      {articleId: articleId, userId: userId}, (err, grade) => {
        if (grade.length === 0) {
          let newGrade = new Grade({
            userId: userId,
            articleId: articleId,
            mark: mark
          });

          newGrade.save((err, grade) => { if (err) throw err });

          req.flash('success_msg', 'Thanks for your grading');
        }
      }) : null;

  res.redirect(`/articles/${articleId}`);
});

router.post('/:id/comment', (req, res) => {
  let message = req.body.message;
  let articleId = req.params.id;
  let userId = req.user._id;

  req.checkBody('message', 'Message is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    req.flash('error_msg', 'Message is empty');
  } else {
    let newComment = new Comment({
      message: message,
      articleId: articleId,
      userId: userId
    });

    newComment.save((err, comment) => {
      if (err) throw err;
    });

    req.flash('success_msg', 'Thanks for your comment');
  }

  res.redirect(`/articles/${articleId}`);
});

module.exports = router;