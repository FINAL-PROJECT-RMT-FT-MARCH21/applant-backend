const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User.model')
const { red } = require('chalk')

const Plant = require('../models/Plant.model')

router.get('/all-plants', (req, res) => {
  Plant.find()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})

// ---------- Sign up ---------- //
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    res.send({ message: "Username and password can't be empty" })
    return
  } else if (password.length < 3) {
    res.send({ message: 'The password must be at least 6 digits long' })
    return
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.send({ message: 'This user already exists' })
        return
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10)
        User.create({ username, password: hashedPassword }).then((result) => {
          res.send({ message: 'User created', result })
        })
      }
    })
    .catch((err) => {
      res.send({ message: `error: ${err}` })
    })
})

// ---------- Log in ---------- //
router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, failureDetails) => {
    if (err) {
      console.log(err)
      res.send({ message: 'Something went bad with Passport Authentication' })
      return
    }

    if (!user) {
      res.send({ message: 'This user does not exist', failureDetails })
      return
    }

    res.cookie('sameSite', 'none', {
      sameSite: true,
      secure: true,
    })

    req.login(user, (err) => {
      if (err) {
        res.send({ message: 'Something went bad with req.login', err })
      } else {
        User.findById(user._id)
          .then((result) => {
            res.send({ message: 'Log in succesful', result })
          })
          .catch(() => {
            res.send({ message: 'Error finding the user' })
          })
      }
    })
  })(req, res)
})

module.exports = router
