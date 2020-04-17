const { ApolloServer } = require('apollo-server')
const { importSchema } = require('graphql-import')
const connectDB = require('./util/db')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken-promisified')
const User = require('./user/user.model')

const PORT = process.env.PORT || 4000

async function main() {
  if (process.env.NODE_ENV !== 'production') dotenv.config()

  await connectDB()

  const typeDefs = await importSchema('./src/schema.gql')

  const resolvers = {
    Query: require('./root/query'),
    Mutation: require('./root/mutation'),
    UserFeedBook: require('./root/UserFeedBook'),
    User: require('./user/user.resolver'),
  }

  const context = async ({ req }) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const { userId } = await jwt.verifyAsync(token, process.env.JWT_SECRET)
      const user = await User.findById(userId)
      return { user }
    } catch (error) {}
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  })

  server.listen(PORT).then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
}
main()
