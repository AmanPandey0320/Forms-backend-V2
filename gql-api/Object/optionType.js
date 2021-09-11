const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID } = graphql;

/**
 * @description option type gql obect
 */
const optionType = new GraphQLObjectType({
  name: "form",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    is_right: { type: GraphQLBoolean },
    marks: { type: GraphQLBoolean },
  }),
});

module.exports = optionType;
