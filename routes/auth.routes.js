const express = require('express')
const router = express.Router()
const chalk = require('chalk')

const bcrypt = require('bcrypt')
const passport = require('passport')

const User = require('../models/User.model')
const { red } = require('chalk')

const Plant = require('../models/Plant.model')

// ---------- Sign up ---------- //
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    res.send({ message: 'You must fill all the fields' })
    return
  } else if (password.length < 3) {
    res.send({ message: 'The password must be at least 6 digits long' })
    return
  } else {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          res.send({
            message: `User ${user.username} already exists`,
            alreadyExists: true,
          })
          return
        } else {
          const hashedPassword = bcrypt.hashSync(password, 10)
          User.create({ username, password: hashedPassword }).then((result) => {
            res.send({
              message: `User ${result.username} created successfully`,
              data: result,
              successSignup: true,
            })
          })
        }
      })
      .catch((err) => {
        res.send({ message: `Error: ${err}` })
      })
  }
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
      res.send({ message: 'Incorrect username or password', failureDetails })
      return
    }
    res.cookie('sameSite', 'none', {
      sameSite: true,
      secure: true,
    })
    req.login(user, (err) => {
      if (err) {
        console.log(err)
        res.send({ message: 'Something went bad logging in' })
      } else {
        User.findById(user._id)
          .populate('cart.plant')
          .populate('favoritePlants')
          .then((result) => {
            res.send({ message: 'Log in successfully', data: result })
          })
          .catch(() => {
            res.send({ message: 'Error finding the user' })
          })
      }
    })
  })(req, res)
})

//------------ Check if the user is logged ----------- //
router.get('/loggedin', (req, res) => {
  if (req.user) {
    User.findById(req.user._id)
      .populate('favoritePlants')
      .populate('cart.plant')
      .then((user) => {
        res.send({ message: 'User sent', data: user })
      })
      .catch((err) => {
        res.send({ message: 'Error sending user' })
      })
  }
})

// ------ Logout ----------- //
router.get('/logout', (req, res) => {
  req.logout()
  res.send({ message: 'Session closed successfully!' })
})

module.exports = router
