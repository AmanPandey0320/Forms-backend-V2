const graphql = require("graphql");
const utils = require("util");
const pool = require("../../../config/db");
const responseType = require("./object");

pool.query = utils.promisify(pool.query);
const { GraphQLObjectType, GraphQLID } = graphql;

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /**
     * @description creates new form and returns id
     */
    newForm: {
      type: responseType,
      async resolve(parent, args, context) {
        const { user } = context;
        const { user_id } = user;
        const sql = `INSERT INTO akp_forms (who)  VALUES (?)`;
        const bind = [user_id];

        try {
          const result = await pool.query(sql, bind);
          const data = [
            {
              id: result.insertId,
              title: "Untitled",
              description: null,
              active: true,
              edit: true,
              send: false,
              theme: null,
            },
          ];
          //   const data = await pool.query(postSql,postBind);
          console.log(result.insertId, data);
          return {
            data,
            err: [],
            message: [],
          };
        } catch (error) {
          return {
            data: [],
            err: [error.message],
            message: [error.message],
          };
        }
      },
    },
    // saveForm:{

    // }
  },
});

module.exports = mutation;
