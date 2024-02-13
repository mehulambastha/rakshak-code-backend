const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const connectionToDB = require('./connection/dbConnection')
dotenv.config()

const app = express()
app.use(bodyParser)
connectionToDB()


app.use("/user/", require('./routes/userRoutes'))

app.listen(process.env.PORT || 3009, ()=>{
  console.log('server fired up and running at port: ', process.env.PORT)
})