const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const Service = require("../services/question");
const Controller = require("../controller/question");

const service = new Service();
const controller = new Controller(service);
const router = Router();

router.use(IS_AUTHENTICATED, IS_VALID_SESSION);
router.post("/save-action", controller.saveAction);
// router.post("/delete-action", controller.deleteAction);
// router.get("/list-action",IS_AUTHENTICATED,IS_VALID_SESSION,controller.fetchSecByFormID);

module.exports = router;