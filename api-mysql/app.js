const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000
const routes = require('./src/routes')

const corsOptions = {
  origin: '*', // Set to only portal URLs
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('morgan')('dev'))
app.use(require('./src/middlewares/responseHandler'))
app.use('/api', routes)
app.use((req, res, next) => next(require('http-errors')(404)))
app.use(require('./src/middlewares/customHttpErrorHandler'))

const server = app.listen(port, async () => {
  try {
    console.log(`App listening at http://localhost:${port}`)
    const { sequelize } = require('./src/models')
    await sequelize.authenticate()
    console.log('Successfully connected to database')
  } catch (error) {
    console.log(error?.original ? error.message : error)
  }
})

module.exports = { app, server }
