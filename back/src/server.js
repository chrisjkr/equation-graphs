'use strict'

import express from 'express'
import bunyan from 'bunyan'
import http from 'http'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import socket from 'socket.io'
import Functions from './modules/functions'

const app = express()
const server = http.Server(app)
const io = socket(server)

const log = bunyan.createLogger({
  name: 'example',
  src: true,
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
    {
      level: 'warn',
      path: '../warn.log'
    },
    {
      level: 'trace',
      path: '../trace.log'
    }
  ]
})

const port = process.env.PORT || 3000

// Database
const mongouri = process.env.MONGOURI || 'mongodb://localhost/ezpz'
mongoose.connect(mongouri)
const db = mongoose.connection
db.on('error', (err) => {
  return log.error(err)
})
db.once('open', () => {
  return log.info('Database connected')
})

// Models
global.MFunction = require('./models/function').default

server.listen(port, () => {
  log.info(`App running on localhost:${port}`)
  new Functions()
})

export {log, io}