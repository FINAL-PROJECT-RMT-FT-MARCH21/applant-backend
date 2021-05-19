const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      createIndexes: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: { type: Boolean, default: false},
    favoritePlants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
      },
    ],
    cart:[ {
      plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
      },
      quantity: {
        type:Number
      }
    }
    ],
    totalPrice: {type:Number, default: 0},
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
      },
    ],
    rating: { type: Number },
  },
  {
    versionKey: false,
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
