const { Router } = require("express");
const { sign_up, sign_in, google, verify } = require("../controller/auth");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const router = Router();

router.post("/signup", google);
router.post("/signin", sign_in);
router.post("/verify", IS_AUTHENTICATED, verify);

module.exports = router;
