let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
  message: {
    type: String,
  },
  articleId: {
    type: String
  },
  userId: {
    type: String
  }
});

let Comment = module.exports = mongoose.model('Comment', CommentSchema);

module.exports.findByArticleId = (articleId, callback) => {
  let query = { articleId: articleId };
  Comment.find(query, callback);
};

module.exports.createComment = (newComment, callback) => {
  newComment.save(callback);
};
