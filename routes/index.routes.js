const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

router.get('/', (req, res, next) => {
  res.send('Backend working :)')
})

router.get('/users', (req, res, next) => {
  User.find()
    .then((result) => {
      res.send({data: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/edit-user/:_id', (req, res, next) => {
  User.findByIdAndUpdate(req.params._id, req.body)
  .then((result) => {
    res.send({message: `User ${result.username} edited`, data: result})
  })
  .catch((err) => {
    console.log(err)
  })
})

router.post('/delete-user/:_id', (req, res, next) => {
  User.findByIdAndDelete(req.params._id)
  .then((result) => {
    res.send({message: `User ${result.username} deleted`, data: result})
  })
  .catch((err) => {
    console.log(err)
  })
})

module.exports = router
