const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const stripe = require("stripe")("sk_test_51IrpUwINyfw3UssjzcCepDXnumsME5h27Cy3PAdcynRAnC4SaS9HLcdSiRYABrzdYIv03RyhjKqcDLaJfe09BKg700VAyyK4Xb");

router.post("/create-payment-intent", (req, res) => {
  const {_id, totalPrice} = req.body
  User.findById(_id)
  .then((user)=>{
    console.log('11', user)
    // const calculateOrderAmount = ()=>{
    //   return user.totalPrice
    // }

    // const { items } = req.body;

    const paymentIntent = stripe.paymentIntents.create({
      amount: totalPrice*100,
      currency: "eur"
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });

 })
  .catch((err)=>{
    res.send(err)
  })

});

module.exports= router