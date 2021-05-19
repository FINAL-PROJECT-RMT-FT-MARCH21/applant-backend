const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
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

const Post = mongoose.model('Post', postSchema)

module.exports = Post
