const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
} = graphql;

const themeType = new GraphQLObjectType({
  name: "theme",
  fields: () => ({
    bgColor: { type: GraphQLString },
    color: { type: GraphQLString },
    header: { type: GraphQLInt },
  }),
});

module.exports = themeType