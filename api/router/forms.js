const { Router, request } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const {
  create,
  getall,
  getone,
  delone,
  updateone,
  CREATE_FROM_TEMPLATE,
} = require("../controller/forms");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const { IS_FORM_TO_USER } = require("../middleware/form");
const router = Router();

router.post("/create", IS_AUTHENTICATED, IS_VALID_SESSION, create);
router.post("/getone", IS_AUTHENTICATED, IS_VALID_SESSION, getone);
router.post("/getall", IS_AUTHENTICATED, IS_VALID_SESSION, getall);
router.post(
  "/delete",
  IS_AUTHENTICATED,
  IS_VALID_SESSION,
  IS_FORM_TO_USER,
  delone
);
router.post(
  "/update",
  IS_AUTHENTICATED,
  IS_VALID_SESSION,
  IS_FORM_TO_USER,
  updateone
);

router.post(
  "/create-from-template",
  IS_AUTHENTICATED,
  IS_VALID_SESSION,
  CREATE_FROM_TEMPLATE
);
module.exports = router;
