const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const Service = require("../services/option");
const Controller = require("../controller/option");

const service = new Service();
const controller = new Controller(service);
const router = Router();

router.use(IS_AUTHENTICATED, IS_VALID_SESSION);
router.post("/save-action", controller.saveAction);

module.exports = router;