const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const router = express.Router();
const TemplateSchema = require("./Schema/template");
const FormSchema = require("./Schema/forms/index");
const { IS_AUTHENTICATED } = require("./middlewares/auth");

router.use(IS_AUTHENTICATED);

router.use(
  "/template",
  graphqlHTTP({
    schema: TemplateSchema,
    graphiql: true,
  })
);

router.use(
  "/form",
  graphqlHTTP({
    schema: FormSchema,
    graphiql: true,
  })
);

module.exports = router;
