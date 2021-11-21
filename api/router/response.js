const { Router } = require("express");
const { IS_VALID_SESSION } = require("../../engines/sessions/helpers");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const ResponseService = require("../services/response");
const ResponseController = require("../controller/response");

const responceService = new ResponseService();
const controller = new ResponseController(responceService);

const router = Router();

router.use(IS_AUTHENTICATED, IS_VALID_SESSION);

router.post("/save-action", controller.saveAction);
router.get("/populate-by-fid", controller.populateByFid);

module.exports = router;
