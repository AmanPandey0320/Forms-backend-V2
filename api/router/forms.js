const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const {
  create,
  getall,
  getone,
  delone,
  updateone,
} = require("../controller/forms");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const { IS_FORM_TO_USER } = require("../middleware/form");
const router = Router();

router.post("/create", IS_AUTHENTICATED, create);
router.post("/getall", IS_AUTHENTICATED,IS_VALID_SESSION, getall);
router.post("/getone", IS_AUTHENTICATED, getone);
router.post("/delete", IS_AUTHENTICATED, IS_FORM_TO_USER, delone);
router.post("/update", IS_AUTHENTICATED, IS_FORM_TO_USER, updateone);

module.exports = router;
