const { ApolloServer, ApolloError } = require('apollo-server')
const { GraphQLError } = require('graphql')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken-promisified')
const connectDB = require('./util/db')
const typeDefs = require('./schema')

const PORT = process.env.PORT || 4000

async function main() {
  if (process.env.NODE_ENV !== 'production') dotenv.config()

  await connectDB()

  const resolvers = [
    require('./resolvers/userResolver'),
    require('./resolvers/bookResolver'),
    require('./resolvers/feedBookResolver'),
    require('./resolvers/feedResolver'),
    require('./resolvers/wishBookResolver'),
    require('./resolvers/bookListResolver'),
  ]

  const context = async ({ req }) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = await jwt.verifyAsync(token, process.env.JWT_SECRET)
      return { decodedToken }
    } catch (error) {
      return {
        decodedToken: {},
      }
    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    tracing: true,
    formatError: error => {
      if (
        error instanceof ApolloError ||
        error.originalError instanceof ApolloError
      ) {
        return error
      } else {
        console.error(error)
        return new GraphQLError('Unknown error occured')
      }
    },
  })

  server.listen(PORT).then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
}
main()
