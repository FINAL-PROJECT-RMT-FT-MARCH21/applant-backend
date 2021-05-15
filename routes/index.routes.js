const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => {
  res.send('Backend working :)')
})

router.get('/all-users', (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  User.find()
    .then((result) => {
      res.send(result)
    })
    .catch((error) => {
      console.log(error)
    })
})

module.exports = router
