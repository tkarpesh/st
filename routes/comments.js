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

module.exports = router;
