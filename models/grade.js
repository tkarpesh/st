let mongoose = require('mongoose');

let GradeSchema = mongoose.Schema({
  mark: {
    type: Number,
  },
  articleId: {
    type: String
  },
  userId: {
    type: String
  }
});

let Grade = module.exports = mongoose.model('Grade', GradeSchema);

module.exports.createGrade = (newGrade, callback) => {
  newGrade.save(callback);
};
