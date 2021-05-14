const express = require('express')
const router = express.Router()

const Plant = require('../models/Plant.model')
const User = require('../models/User.model')

router.get('/all-plants', (req, res)=>{
  Plant.find()
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err)
  })
})

 router.post('/delete-plant/:_id', (req, res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {favoritePlants: req.params._id}})
  .then((result)=>{
      res.send(result)
  })
  .catch((error)=>{
    res.send(error)
  })
}) 


module.exports = router
