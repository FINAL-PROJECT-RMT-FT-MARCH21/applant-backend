const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const stripe = require("stripe")("sk_test_51IrpUwINyfw3UssjzcCepDXnumsME5h27Cy3PAdcynRAnC4SaS9HLcdSiRYABrzdYIv03RyhjKqcDLaJfe09BKg700VAyyK4Xb");

router.post("/create-payment-intent", (req, res) => {
  const {_id, totalPrice} = req.body
  User.findById(_id)
  .then((user)=>{
  

    const paymentIntent = stripe.paymentIntents.create({
      amount: totalPrice*100,
      currency: "eur"
    })
      .then((result) =>{
        console.log('19', result , req.body)
        res.send({clientSecret: result.client_secret.toString() })

        User.findByIdAndUpdate(_id,  { cart:[], totalPrice: 0 } ,{ new: true })
          .then((result)=>{
            console.log(result)
          })
      })
 })
  .catch((err)=>{
    res.send(err)
  })

});

module.exports= router