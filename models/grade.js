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

mongoose.model('Grade', GradeSchema);
