const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./util/db')
const apollo = require('./apollo')

const PORT = process.env.PORT || 4000
const app = express()

async function main() {
  if (process.env.NODE_ENV !== 'production') dotenv.config()
  await connectDB()

  const apolloServer = apollo()

  app.use(apolloServer.getMiddleware())

  app.listen(PORT, () => {
    console.log(`Server running`)
  })
}
main()
