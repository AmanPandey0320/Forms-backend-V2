const graphql = require("graphql");
const utils = require("util");
const pool = require("../../../config/db");
const responseType = require("./object");

pool.query = utils.promisify(pool.query);
const { GraphQLObjectType, GraphQLID } = graphql;

/**
 * @description root query for forms
 */
const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    /**
     * sends all forms by a user
     */
    forms: {
      type: responseType,
      async resolve(parent, args, context) {
        const { user } = context;
        const { user_id } = user;

        const sql = `SELECT frm.id,frm.title,frm.description,frm.active,frm.edit,frm.send,frm.theme FROM akp_forms as frm`;
        
        try {
          const data = await pool.query(sql);
          const cData = await pool.query(cSql,[1,2]);
          console.log(cData);
          const response = {
            data,
            err: [],
            message: ["Successfully sent!"],
          };
          return response;
        } catch (error) {
          const response = {
            data: [],
            err: [error.message],
            message: ["Some error occured"],
          };
          return response;
        }
      },
    },
    form: {
      type: responseType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const sql = `SELECT frm.id,frm.title,frm.description,frm.active,frm.edit,frm.send,frm.theme FROM akp_forms as frm WHERE frm.id = ? and active = ?`;
        const bind = [args.id, true];

        try {
          const data = await pool.query(sql, bind);
          const response = {
            data,
            err: [],
            message: ["Successfully sent"],
          };
          return response;
        } catch (err) {
          const response = {
            data: [],
            err: [err.message],
            data: ["Some error occured"],
          };
          return response;
        }
      },
    },
  },
});

module.exports = rootQuery;
