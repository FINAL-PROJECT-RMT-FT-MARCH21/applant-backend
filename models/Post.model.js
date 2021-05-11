const mongoose = require('mongoose')

const Schema = mongoose.Schema

const plantSchema = new Schema(
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

const Plant = mongoose.model('Plant', plantSchema)

module.exports = Plant
