const { Schema, model } = require("mongoose");
const commentsSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  blogId: {
    type: Schema.Types.ObjectId,
    ref: "blog",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  }
}, { timestamps: true });
const comment = model('comment', commentsSchema);
module.exports = comment;