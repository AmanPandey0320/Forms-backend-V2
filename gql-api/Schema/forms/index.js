const graphql = require("graphql");
const mutation = require("./mutation");
const rootQuery = require("./query");
const { GraphQLSchema } = graphql;

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation: mutation,
});
