const { ApolloServer, ApolloError } = require('apollo-server-express')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken-promisified')

module.exports = () => {
  return new ApolloServer({
    typeDefs: require('./schema'),
    resolvers: [
      require('./resolvers/userResolver'),
      require('./resolvers/bookResolver'),
      require('./resolvers/feedBookResolver'),
      require('./resolvers/feedResolver'),
      require('./resolvers/wishBookResolver'),
      require('./resolvers/bookListResolver'),
      require('./resolvers/categoryResolver'),
    ],
    context: async ({ req }) => {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = await jwt.verifyAsync(
          token,
          process.env.JWT_SECRET
        )
        return { decodedToken }
      } catch (error) {
        return {
          decodedToken: {},
        }
      }
    },
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
}
