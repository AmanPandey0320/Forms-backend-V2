const { Router } = require("express");
const router = Router();

router.use("/auth", require("./router/auth"));
router.use("/form", require("./router/form"));
router.use("/section", require("./router/section"));
router.use("/question", require("./router/question"));
router.use("/option", require("./router/option"));
router.use("/storage", require("./router/storage"));
router.use("/response", require("./router/response"));

module.exports = router;
