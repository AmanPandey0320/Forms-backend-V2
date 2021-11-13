const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const FormService = require("../services/form");
const SecService = require("../services/section");
const QueService = require("../services/question");
const OptionService = require("../services/option");
const Controller = require("../controller/form");

const router = Router();
const fromService = new FormService();
const secService = new SecService();
const queService = new QueService();
const optionService = new OptionService();
const controller = new Controller(
  fromService,
  secService,
  queService,
  optionService
);

router.use(IS_AUTHENTICATED, IS_VALID_SESSION);
router.post("/save-action", controller.saveAction);
router.get("/list-action", controller.listAction);
router.get("/populate-action", controller.populateAction);
router.post("/create-from-template", controller.createFromTemplate);

module.exports = router;
