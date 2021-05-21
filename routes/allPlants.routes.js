const express = require('express')
const router = express.Router()

const Plant = require('../models/Plant.model')

const toUpper = (word) => {
  if (word) return word[0].toUpperCase() + word.slice(1)
}

router.get('/plants', (req, res)=>{
  Plant.find()
  .then((result) => {
    res.send({data: result})
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/new-plant', (req, res) => {
  Plant.create(req.body)
  .then((result) => {
    res.send({message: `${toUpper(result.commonName)} created`, data: result})
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/edit-plant/:_id', (req, res) => {
  Plant.findByIdAndUpdate(req.params._id, req.body,{new:true})
  .then((result) => {
    res.send({message: `${toUpper(result.commonName)} edited`, data: result})
  })
  .catch((err) => {
    console.log(err)
  })
})

 router.post('/delete-plant/:_id', (req, res) => {
  Plant.findByIdAndDelete(req.params._id)
  .then((result)=>{
    res.send({message: `${toUpper(result.commonName)} deleted`, data: result})
  })
  .catch((err)=>{
    res.send(err)
  })
})

module.exports = router
