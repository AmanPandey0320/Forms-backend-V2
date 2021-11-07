const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const Service = require("../services/section");
const Controller = require("../controller/section");
const pool = require("../../config/db");

const service = new Service(pool);
const controller = new Controller(service);
const router = Router();

router.post(
  "/save-action",
  IS_AUTHENTICATED,
  IS_VALID_SESSION,
  controller.saveAction
);

module.exports = router;
