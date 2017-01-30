let mongoose = require('mongoose');

let ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    index: true
  },
  content: {
    type: String
  },
  userId: {
    type: String
  }
});

let Article = module.exports = mongoose.model('Article', ArticleSchema);
