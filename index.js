require('dotenv').config()
require('express-async-errors')

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express')
const app = express()

// CONNECT TO DB
const connectDB = require('./db/connect')
const authenticateUser = require('./middlewares/authentication')

// ROUTES
const authRoutes = require('./routes/auth')
const jobsRoutes = require('./routes/jobs')

// ERROR HANDLERS
const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

// ROUTES
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1> <a href="/api-docs">API Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', authenticateUser, jobsRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 9000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
