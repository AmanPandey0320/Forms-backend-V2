const graphql = require("graphql");
const questionType = require("./questionType");
const themeType = require("./theme");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList } =
  graphql;

/**
 * @description form type gql obect
 */
const sectionType = new GraphQLObjectType({
  name: "form",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    order: { type: GraphQLInt },
    theme: { type: themeType },
    questions: { type: GraphQLList(questionType) },
  }),
});

module.exports = sectionType;
