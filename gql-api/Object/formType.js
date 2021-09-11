const graphql = require("graphql");
const sectionType = require("./sectionType");
const themeType = require("./theme");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
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
    sections: { type: GraphQLList(sectionType) },
  }),
});

module.exports = formType;
