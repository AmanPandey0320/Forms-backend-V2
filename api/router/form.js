const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const Service = require("../services/form");
const Controller = require("../controller/form");

const router = Router();
const service = new Service();
const controller = new Controller(service);

router.use(IS_AUTHENTICATED, IS_VALID_SESSION);
router.post("/save-action", controller.saveAction);
router.get("/list-action", controller.listAction);
router.get("/populate-action", controller.populateAction);
router.post("/create-from-template", controller.createFromTemplate);

module.exports = router;
