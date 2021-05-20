require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const passport = require('passport')
const chalk = require('chalk')
const flash = require('connect-flash')
const cors = require('cors')
const path = require('path')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/User.model')

// ---------- Mongoose ---------- //
require('./configs/mongoose')

// ---------- Express ---------- //
const app = express()

// ---------- Middleware setup ---------- //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// -------- CORS --------
app.use(
  cors({
    methods: ['GET', 'POST'],
    credentials: true,
    origin: ['http://localhost:3000'],
  })
)

// -------- PASSPORT --------
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)
passport.serializeUser((user, callback) => {
  callback(null, user._id)
})
passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((result) => {
      callback(null, result)
    })
    .catch((err) => {
      callback(err)
    })
})
app.use(flash())
passport.use(
  new LocalStrategy(
    {
      usernameField: `username`,
      passwordField: `password`,
      passReqToCallback: true,
    },
    (req, username, password, next) => {
      User.findOne({ username })
      .then((user) => {
          if (!user) {
            return next(null, false, {
              message: `Incorrect username or password`,
            })
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, {
              message: `Incorrect username or password`,
            })
          }
          return next(null, user)
        })
        .catch((err) => {
          next(err)
        })
    }
  )
)
app.use(passport.initialize())
app.use(passport.session())

// ---------- ROUTES ---------- //
app.use('/app', require('./routes/index.routes'))
app.use('/app', require('./routes/auth.routes'))
app.use('/app', require('./routes/allPlants.routes'))
app.use('/app', require('./routes/posts.routes'))
app.use('/app', require('./routes/profile.routes'))
app.use('/app', require('./routes/stripe.routes'))

// app.use((req, res, next)=>{
//   res.sendFile(__dirname+'/public/index.html')
// })

// ---------- LISTENER ---------- //
app.listen(process.env.PORT || 5000, () => {
  console.log(chalk.green.inverse('Port activated'))
})