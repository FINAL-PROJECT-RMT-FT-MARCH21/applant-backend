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
  User.findByIdAndUpdate(req.user._id, {
    $pull: { favoritePlants: req.params._id },
  })
    .then((result) => {
      res.send({message: `${toUpper(result)} removed from favorites`, data: result})
    })
    .catch((error) => {
      res.send(error)
    })
})

// -------------- Put item into cart ------------------ //
router.post('/add-to-cart', (req, res) => {
  const { plantId } = req.body
  const newQuantity = req.body.quantity
  
  Plant.findById(plantId)
  .then((plant) => {
      if (req.user){
        const cartPlants = req.user.cart.map((item)=>{
          return item.plant
        })
        if (!cartPlants.includes(plantId)) {
          User.findByIdAndUpdate(req.user._id, {$push: { cart: { plant: plantId, quantity: newQuantity } }},{ new: true }) 
          .populate('cart')
          .populate('cart.plant')
            .then((result) => {
              res.send({
                message: `${toUpper(plant.commonName)} plant added to your cart`,
                user: result,
                updatedPlant: ''
              })
              })
        } else {
          User.findById(req.user._id)
          .populate('cart')
          .populate('cart.plant')
          .then((result) => {
            const repeatedItem = result.cart.filter((item)=>{
              return item.plant._id == plantId
            })[0]
<<<<<<< HEAD
=======
            //console.log('repeatedItem:', repeatedItem)
>>>>>>> 0fc59d8819e755c6fdc0a8f0a68d95a52304ee6b
            const updatedItem = {
              plant: repeatedItem.plant,
              quantity: Number(repeatedItem.quantity) + Number(newQuantity)
            }
<<<<<<< HEAD
            res.send({
              message: `${toUpper(plant.commonName)} plant added to your cart`,
              data: updatedItem
=======
            const cartWithoutUpdatingPlant = result.cart.filter((item)=>{
              console.log(plantId.toString() != item.plant._id)
              return item.plant._id != plantId.toString()
            })

            cartWithoutUpdatingPlant.push(updatedItem)
            
            User.findByIdAndUpdate(req.user._id, {cart: cartWithoutUpdatingPlant},{new: true})
            .then(()=>{
              res.send({
                message: `${toUpper(plant.commonName)} plant added to your cart`,
                user: '',
                updatedPlant: updatedItem
              })
>>>>>>> 0fc59d8819e755c6fdc0a8f0a68d95a52304ee6b
            })
          }) 
        }
      }
    }
    )
    .catch((error) => {
      console.log(error)
      res.send({ message: 'Error adding to cart' })
    })
  })

// -------------- Remove store item from cart ------------------ //
router.post('/remove-from-cart/:_id', (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $pull: {cart: {plant: req.params._id}},
  })
    .populate('cart.plant')
    .then((result) => {
      res.send(result)
    })
    .catch((error) => {
      res.send(error)
    })
})

module.exports = router
