const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Plant = mongoose.model('Plant', plantSchema)

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postContent: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
)


module.exports = Post
