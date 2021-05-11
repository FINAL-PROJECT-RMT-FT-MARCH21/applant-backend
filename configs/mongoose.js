const mongoose = require('mongoose')

mongoose
  .connect(
    'mongodb+srv://Thornnk:database@cluster0.tpwjp.mongodb.net/applant',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err)
  })
