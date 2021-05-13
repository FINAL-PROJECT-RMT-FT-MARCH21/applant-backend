const express = require('express')
const router = express.Router()
const chalk = require('chalk')

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
    //console.log(chalk.red.inverse('====>'+ user.username))
    if (err) {
      console.log(err)
      res.send({ message: 'Something went bad with Passport Authentication'})
      return
    }
    // if(user.username === ' ' || user.password === ' '){
    //   res.send({message: 'Missing credentials', failureDetails})
    //   return
    // }
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
        res.send({ message: 'Something went bad with req.login', err })
      } else {
        User.findById(user._id)
          .populate('favoritePlants')
          .then((result) => {
            res.send({ message: 'Log in successfully', result })
          })
          .catch(() => {
            res.send({ message: 'Error finding the user' })
          })
      }
    })
  })(req, res)
})

router.get('/loggedin', (req, res) => {
  console.log('logged in!')
  if (req.user) {
    User.findById(req.user._id)
    .populate('favoritePlants')
    .then((user) => {
      console.log('user correct: ', user)
      res.send({message: 'User sent', user})
    })
    .catch((err) => {
      res.send({message: 'Error sending user'})
    })
  } else {
    console.log('Error sending user (else)')
    res.send(req.user)
  }
})

// ------ Logout ----------- //
router.get('/logout', (req, res) => {
  req.logout()
  res.send({ message: 'Session closed successfully!' })
})

module.exports = router
