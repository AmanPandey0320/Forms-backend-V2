const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const router = express.Router();
const TemplateSchema = require("./Schema/template");
const { IS_AUTHENTICATED } = require("./middlewares/auth");

router.use(IS_AUTHENTICATED);

router.use(
  "/template",
  graphqlHTTP({
    schema: TemplateSchema,
    graphiql: true,
  })
);

module.exports = router;
