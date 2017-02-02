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

module.exports.createArticle = (newArticle, callback) => {
  newArticle.save(callback);
};

module.exports.updateArticle = (articleId, query, callback) => {
  Article.update({_id: articleId}, query, callback);
};
