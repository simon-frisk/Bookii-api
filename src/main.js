const { ApolloServer, ApolloError } = require('apollo-server')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const connectDB = require('./util/db')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken-promisified')
const typeDefs = require('./schema')
const User = require('./data/user.model')

const PORT = process.env.PORT || 4000

async function main() {
  if (process.env.NODE_ENV !== 'production') dotenv.config()

  await connectDB()

  const resolvers = [
    require('./resolvers/userResolver'),
    require('./resolvers/bookResolver'),
    require('./resolvers/feedBookResolver'),
    require('./resolvers/feedResolver'),
  ]

  const context = async ({ req }) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const { _id } = await jwt.verifyAsync(token, process.env.JWT_SECRET)
      const user = await User.findById(_id)
      return { user }
    } catch (error) {}
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    tracing: true,
    formatError: error => {
      console.log(error)
      if (
        error instanceof ApolloError ||
        error.originalError instanceof ApolloError
      ) {
        return error
      } else return new GraphQLError('Unknown error occured')
    },
  })

  server.listen(PORT).then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
}
main()
