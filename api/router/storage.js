const { Router } = require("express");
const { upload, download, DOWNLOAD } = require("../controller/storage");
const UPLOADER = require("../middleware/storage");
const { IS_AUTHENTICATED } = require("../middleware/auth");
const router = Router();

router.post("/upload", UPLOADER, IS_AUTHENTICATED, upload);
router.get("/download/:name", IS_AUTHENTICATED, download);
// router.get("/download",IS_AUTHENTICATED,DOWNLOAD);

module.exports = router;
