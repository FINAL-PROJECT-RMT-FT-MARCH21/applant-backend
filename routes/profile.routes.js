const express = require('express')
const router = express.Router()

const User = require('../models/User.model')
const Plant = require('../models/Plant.model')

router.get('/profile', (req, res, next) => {
  res.send('profile send from backend!')
})

// ------------ Add plant to favorites --------------- //
router.post('/add-plant', (req, res) => {
  const { plantId, user } = req.body
  Plant.findById(plantId)
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

// -------------- Add item to cart ------------------ //

router.post('/add-to-cart', (req, res) => {
  const { plantId, quantity, user } = req.body
  Plant.findById(plantId)
    .then((plant) => {
      if (plant) {
        if (!req.user.cart.includes(plant._id)) {
          User.findByIdAndUpdate(
            req.user._id,
            {
              $push: { cart: { plant: plant._id, quantity: quantity } },
            },
            { new: true }
          )
          User.populate('cart.plant').then((result) => {
            res.send({
              message: `${plant.commonName} added to your cart`,
              result,
            })
          })
        } else {
          res.send({
            message: 'This plant has been already added to your cart',
          })
        }
      } else {
        Plant.create(req.body).then((result) => {
          User.findByIdAndUpdate(req.user._id, {
            $push: { cart: { plant: plant._id, quantity: quantity } },
          })
          User.populate('cart.plant').then((result) => {
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

module.exports = router
