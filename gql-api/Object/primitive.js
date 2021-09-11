const { GraphQLString, GraphQLObjectType, GraphQLInt } = require("graphql");

const STRING = new GraphQLObjectType({
  name: "STRING",
  fields: () => ({
    data: { type: GraphQLString },
  }),
});

const INTEGER = new GraphQLObjectType({
  name: "INTEGER",
  fields: () => ({
    data: { type: GraphQLInt },
  }),
});

module.exports = { STRING, INTEGER };
