const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const router = express.Router();
const TemplateSchema = require('./Schema/template');

router.use('/template',graphqlHTTP({
    schema:TemplateSchema,
    graphiql:true
}));

module.exports = router;