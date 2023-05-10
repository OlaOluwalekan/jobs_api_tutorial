require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// ERROR HANDLERS
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')

app.use(express.json())

// ROUTES
app.get('/', (req, res) => {
  res.send('jobs api')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 9000

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
