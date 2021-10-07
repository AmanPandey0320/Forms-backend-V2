const { Router } = require("express");
const {
  ADMIN_LOGIN,
  ADMIN_CREATE,
  ADMIN_UPDATE,
  ADMIN_TOGGLE,
} = require("../Controller/user");
const { IS_SUPER, IS_ADMIN } = require("./helpers/user");
const router = Router();

router.post("/login", ADMIN_LOGIN);
router.post("/create", IS_SUPER, ADMIN_CREATE);
router.post("/update", IS_ADMIN, ADMIN_UPDATE);
router.post("/toggle",IS_SUPER,ADMIN_TOGGLE);

module.exports = router;
