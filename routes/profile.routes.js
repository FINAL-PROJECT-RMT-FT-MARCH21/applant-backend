const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

router.get('/profile', (req, res, next) => {
  res.send('profile send from backend!')
})

router.get('/loggedin', (req, res, next) => {
  res.send(req.user)
})

// router.get(`/user-list/:username`, (req, res) => {
//   console.log(req.user)
//   const { username } = req.params

//   User.findOne({ username })
//     .then((result) => {
//       console.log(result)
//       res.send({ username: result.username, pokedex: result.pokedex })
//     })
//     .catch((err) => {
//       console.log(err)
//       res.send({ message: 'User not found' }, err)
//     })
// })

// router.post('/add-pokemon', (req, res) => {
//   console.log(req.user)
//   const { name } = req.body
//   Pokemon.findOne({ name })
//     .then((result) => {
//       if (result) {
//         if (!req.user.pokedex.includes(result._id)) {
//           User.findByIdAndUpdate(req.user._id, {
//             $push: { pokedex: result._id },
//           }).then((result) => {
//             console.log(result)
//             res.send({ message: 'Pokemon added successfully', result })
//           })
//         } else {
//           res.send({ message: 'This pokemon has been already added' })
//         }
//       } else {
//         Pokemon.create(req.body).then((result) => {
//           console.log(result)
//           User.findByIdAndUpdate(req.user._id, {
//             $push: { pokedex: result._id },
//           }).then((result) => {
//             console.log(result)
//             res.send({
//               message: 'Pokemon created and added successfully',
//               result,
//             })
//           })
//         })
//       }
//     })
//     .catch((error) => {
//       console.log(error)
//       res.send({ message: 'Error adding pokemon' })
//     })
// })

module.exports = router
