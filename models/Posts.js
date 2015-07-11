var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  room_no: String,
  name: String,
  bhawan: String,
  preference: String,
  interests: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  email: {
    type: String,
    lowercase: true
  },
  mobile: String,
  pub_date: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

PostSchema.methods.upvote = function(cb) {
  this.interests += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);
