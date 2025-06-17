import bodyParser from 'body-parser'
import express from 'express'

const createApp = () => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  return app
}

export default {createApp}
