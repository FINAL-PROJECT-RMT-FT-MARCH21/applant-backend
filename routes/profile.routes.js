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
                data: result,
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
                data: result,
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
  const plantId = req.body.plantId
  const newQuantity = req.body.quantity
  
  Plant.findById(plantId)
  .then((plant) => {
    if (req.user){
      const cartPlants = req.user.cart.map((item)=>{
        return item.plant
      })
      if (!cartPlants.includes(plantId)) {  //cuando añado una planta nueva al carrito (una que no tenía antes)
        User.findByIdAndUpdate(req.user._id, {$push: { cart: { plant: plantId, quantity: newQuantity } }},{ new: true }) 
        .populate('cart')
        .populate('cart.plant')
        .then(() => {
          User.findById(req.user._id)
          .populate('cart')
          .populate('cart.plant')
          .then((updatedUser) => {
            const totalPrice = updatedUser.cart.reduce((accumulator, element) => {
              return accumulator + element.plant.price * element.quantity
            }, 0)
            User.findByIdAndUpdate(req.user._id, {totalPrice}, {new:true})
            .then((user)=>{
              res.send({
                message: `${toUpper(plant.commonName)} plant added to your cart`,
                user,
                updatedPlant: ''
              })
            })
          })
        })
      } else {  //Cuando modifico la cantidad de plantas (paso de 2 aloe vera a 5, por ejemplo)
        User.findById(req.user._id)
        .populate('cart')
        .populate('cart.plant')
        .then((userBeforeUpdating) => {
          const repeatedItem = userBeforeUpdating.cart.filter((item)=>{
            return item.plant._id == plantId
          })[0]
          const updatedItem = {
            plant: repeatedItem.plant,
            quantity: Number(repeatedItem.quantity) + Number(newQuantity)
          }
          const cartWithoutUpdatingPlant = userBeforeUpdating.cart.filter((item)=>{
            return item.plant._id != plantId.toString()
          })

          const updatedCart = [...cartWithoutUpdatingPlant]
          updatedCart.unshift(updatedItem)
            
          User.findByIdAndUpdate(req.user._id, {cart: updatedCart}, {new: true})
          .then(()=>{
            User.findById(req.user._id)
            .populate('cart')
            .populate('cart.plant')
            .then((updatedUser) => {
              const totalPrice = updatedUser.cart.reduce((accumulator, element) => {
                return accumulator + element.plant.price * element.quantity
              }, 0)
              User.findByIdAndUpdate(req.user._id, {totalPrice}, {new:true})
              .then((user)=>{
                res.send({
                  message: `${toUpper(plant.commonName)} plant added to your cart`,
                  user,
                  updatedPlant: updatedItem
                })
              })
            })
          })
        }) 
      }
    }  
  })
})

// -------------- Remove store item from cart ------------------ //
router.post('/remove-from-cart/:_id', (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $pull: {cart: {plant: req.params._id}}} , {new:true})
  .then(() => {
    User.findById(req.user._id)
    .populate('cart')
    .populate('cart.plant')
    .then((updatedUser) => {
      const totalPrice = updatedUser.cart.reduce((accumulator, element) => {
        return accumulator + element.plant.price * element.quantity
      }, 0)
      User.findByIdAndUpdate(req.user._id, {totalPrice}, {new:true})
      .then((user)=>{
        res.send({
          message: 'This plant has been deleted from your cart',
          // user
        })
      })
    })
  })
  .catch((error) => {
    console.log(error)
    res.send(error)
  })
})

module.exports = router



