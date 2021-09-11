const graphql = require("graphql");
const optionType = require("./optionType");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList } =
  graphql;

/**
 * @description form type gql obect
 */
const questionType = new GraphQLObjectType({
  name: "form",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    order: { type: graphql.GraphQLInt },
    type: { type: GraphQLInt },
    options: { type: GraphQLList(optionType) },
  }),
});

module.exports = questionType;
