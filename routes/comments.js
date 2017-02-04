let express = require('express');
let router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');
let Comment = require('../models/comment');

router.get('/:articleId', (req, res) => {
  let articleId = req.params.articleId;

  Comment.findByArticleId(articleId, (err, docs) => {
    if (err) throw err;

    res.render(
      'comments/index',
      { comments: docs, user: req.user, articleId: articleId }
    )
  });
});

router.post('/create', (req, res) => {
  let message = req.body.message;
  let articleId = req.body.articleId;
  let userId = req.body.userId;

  req.checkBody('message', 'Title is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    Comment.findByArticleId(articleId, (err, docs) => {
      if (err) throw err;

      res.render(
        'comments/index',
        { comments: docs,
          user: req.user,
          articleId: articleId,
          errors: errors
        }
      );
    });
  } else {
    let newComment = new Comment({
      message: message,
      articleId: articleId,
      userId: userId
    });

    Comment.createComment(newComment, (err, comment) => {
      if (err) throw err;
    });

    req.flash('success_msg', 'You are registered');
    res.redirect(`/${articleId}`);
  }
});

module.exports = router;
