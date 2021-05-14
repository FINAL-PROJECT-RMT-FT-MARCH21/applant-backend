const mongoose = require('mongoose')

const Schema = mongoose.Schema

const plantSchema = new Schema(
  {
    commonName: {
      type: String,
      required: true,
    },
    botanicalName: {
      type: String,
      required: true,
    },
    maintenance: {
      type: String,
    },
    water: {
      type: String,
    },
    type: {
      type: [String],
    },
    purifying: {
      type: Boolean,
    },
    safety: {
      type: String,
    },
    about: {
      type: String,
    },
    image: {
      type: String,
    },
    exposure: {
      type: [String],
    },
    price: {type:Number,},
    stock: {type: Number},
    inStore: {type: Boolean} 
  },
  {
    versionKey: false,
  }
)

const Plant = mongoose.model('Plant', plantSchema)

module.exports = Plant
