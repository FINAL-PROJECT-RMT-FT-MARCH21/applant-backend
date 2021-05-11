const express = require('express')
const router = express.Router()

const Plant = require('../models/Plant.model')

router.get('/all-plants', (req, res)=>{
  Plant.find()
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err)
  })
})

module.exports = router
