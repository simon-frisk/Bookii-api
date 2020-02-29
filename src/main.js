const { ApolloServer } = require('apollo-server')
const { importSchema } = require('graphql-import')

const PORT = process.env.PORT || null

async function main() {
  const typeDefs = await importSchema('./src/schema.gql')

  const resolvers = {
    Query: {
      hello: () => 'hello world'
    }
  }

  const server = new ApolloServer({ typeDefs, resolvers })

  server.listen(PORT).then(({ url }) => {
    console.log(`Server running at ${url}`)
  })
}
main()
