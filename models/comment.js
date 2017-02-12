let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
  message: {
    type: String,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    reference: 'Article'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    reference: 'User'
  }
});

mongoose.model('Comment', CommentSchema);
