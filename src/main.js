const { ApolloServer, ApolloError, UserInputError } = require('apollo-server')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const connectDB = require('./util/db')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken-promisified')
const typeDefs = require('./schema')
const User = require('./user/user.model')

const PORT = process.env.PORT || 4000

async function main() {
  if (process.env.NODE_ENV !== 'production') dotenv.config()

  await connectDB()

  const resolvers = {
    Query: require('./root/query'),
    Mutation: require('./root/mutation'),
    FeedBook: require('./feedbook/feedbook.resolver'),
    User: require('./user/user.resolver'),
  }

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
      } else if (error.originalError instanceof mongoose.Error) {
        if (error.originalError.errors) {
          const errors = []
          for (let e in error.originalError.errors) {
            errors.push(error.originalError.errors[e].message)
          }
          return new ApolloError(errors.join(', '))
        }
      } else return new GraphQLError('Unknown error occured')
    },
  })

  server.listen(PORT).then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
}
main()
