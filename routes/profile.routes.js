const express = require('express')
const router = express.Router()

const User = require('../models/User.model')
const Plant = require('../models/Plant.model')


const toUpper = (word) => {
  if (word) return word[0].toUpperCase() + word.slice(1)
}

// ------------ Append plant to favorites --------------- //
router.post('/add-to-favorites/:_id', (req, res) => {
  Plant.findById(req.params._id)
    .then((plant) => {
      if (plant) {
        if (!req.user.favoritePlants.includes(plant._id)) {
          User.findByIdAndUpdate(
            req.user._id,
            {
              $push: { favoritePlants: plant._id },
            },
            { new: true }
          )
            .populate('favoritePlants')
            .then((result) => {
              res.send({
                message: `${plant.commonName} added successfully`,
                result,
              })
            })
        } else {
          res.send({ message: 'This plant has been already added' })
        }
      } else {
        Plant.create(req.body).then((result) => {
          User.findByIdAndUpdate(req.user._id, {
            $push: { favoritePlants: result._id },
          })
            .populate('favoritePlants')
            .then((result) => {
              res.send({
                message: `${result.commonName} created and added successfully`,
                result,
              })
            })
        })
      }
    })
    .catch((error) => {
      console.log(error)
      res.send({ message: 'Error adding plant' })
    })
})

// -------------- Remove plant from favorites ------------------ //
router.post('/remove-from-favorites/:_id', (req, res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {favoritePlants: req.params._id}})
  .then((result)=>{
      res.send(result)
  })
  .catch((error)=>{
    res.send(error)
  })
})

// -------------- Put item into cart ------------------ //
router.post('/add-to-cart', (req, res) => {
  const { plantId, quantity } = req.body
  Plant.findById(plantId)
    .then((plant) => {
      if (!req.user.cart.includes(plant._id)) {
        User.findByIdAndUpdate(
          req.user._id,
          {
            $push: { cart: { plant: plant._id, quantity: quantity } },
          },
          { new: true }
        )
        .populate('cart').populate('cart.plant').then((result) => {
          res.send({
            message: `${toUpper(plant.commonName)} plant added to your cart`,
            data: result,
          })
        })
      } else {
        // TODO +1 to quantity en vez de send
        res.send({
          message: 'This plant has been already added to your cart',
        })
      }
    })
    .catch((error) => {
      console.log(error)
      res.send({ message: 'Error adding to cart' })
    })
})

// -------------- Remove store item from favorites ------------------ //
router.get('/remove-from-cart/:_id', (req, res) => {
  User.findByIdAndDelete(req.user._id)
  .then((result)=>{
      res.send({message: `${toUpper(result.commonName)} removed from cart`, data: result})
  })
  .catch((error)=>{
    res.send(error)
  })
})

module.exports = router
