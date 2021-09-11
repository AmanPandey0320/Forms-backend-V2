const graphql = require("graphql");
const themeType = require("../../Object/theme");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
} = graphql;

/**
 * @description form type gql obect
 */
const formType = new GraphQLObjectType({
  name: "form",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    edit: { type: GraphQLBoolean },
    send: { type: GraphQLBoolean },
    theme: { type: themeType },
  }),
});

/**
 * @description default responce of graph ql
 */
const responseType = new GraphQLObjectType({
  name: "ResponseType",
  fields: () => ({
    data: { type: GraphQLList(formType) },
    err: { type: GraphQLList(GraphQLString) },
    message: { type: GraphQLList(GraphQLString) },
  }),
});

module.exports = responseType;