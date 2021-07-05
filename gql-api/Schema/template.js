const graphql = require('graphql');
const utils = require('util');
const _ = require('lodash');
let pool = require('../../config/db');
pool.query = utils.promisify(pool.query);
const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = graphql;

const ThemeType = new GraphQLObjectType({
    name:'theme',
    fields:() => ({
        header:{type:GraphQLInt},
        color:{type:GraphQLString},
        bgColor:{type:GraphQLString}
    })
});

const DataType = new GraphQLObjectType({
    name:'data',
    fields:() => ({
        type:{type:GraphQLString},
        key:{type:GraphQLString},
        required:{type:GraphQLBoolean},
        question:{type:GraphQLString},
        options:{type:new GraphQLList(GraphQLString)}
    })
});

const TemplateType = new GraphQLObjectType({
    name:'template',
    fields:() => ({
        template_id:{type:GraphQLString},
        title:{type:GraphQLString},
        theme:{
            type:ThemeType,
            resolve(parent){
                return JSON.parse(parent.theme)
            }
        },
        created_by:{type:GraphQLString},
        data:{
            type:GraphQLList(DataType),
            resolve(parent,args){
                return JSON.parse(parent.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        templates:{
            type:GraphQLList(TemplateType),
            async resolve(parent,args){
                const sql = `SELECT template_id,title,theme,created_by,data FROM template WHERE enabled = ?`;
                const result = await pool.query(sql,[true]);
                let response = [];
                result.forEach(element => {
                    response.push({
                        template_id:element.template_id,
                        title:element.title,
                        theme:element.theme,
                        created_by:element.created_by,
                        data:element.data
                    });
                });
                return response;
            }
        },
        template:{
            type:TemplateType,
            args:{template_id:{type:GraphQLString}},
            async resolve(parent,args){
                const sql = `SELECT template_id,title,theme,created_by,data FROM template WHERE enabled = ? AND template_id = ?`
                const bind = [true,args.template_id];
                const result = await pool.query(sql,bind);
                const response = result[0];
                return response;
            }
        }
    },
});

module.exports = new GraphQLSchema({
    query:RootQuery,
});

