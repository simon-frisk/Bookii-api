const { ApolloServer } = require('apollo-server')
const { importSchema } = require('graphql-import')
const connectDB = require('./util/db')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken-promisified')

const PORT = process.env.PORT || 4000

async function main() {
  if (process.env.NODE_ENV !== 'production') dotenv.config()

  await connectDB()

  const typeDefs = await importSchema('./src/root/schema.gql')

  const resolvers = {
    Query: require('./root/query'),
    Mutation: require('./root/mutation'),
    UserReadBook: require('./root/UserReadBook')
  }

  const context = async ({ req }) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const { userId } = await jwt.verifyAsync(token, process.env.JWT_SECRET)
      return { userId }
    } catch(error) {}
  }

  const server = new ApolloServer({ typeDefs, resolvers, context })

  server.listen(PORT).then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
}
main()
