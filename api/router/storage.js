const { Router } = require('express');
const { upload, download } = require('../controller/storage');
const UPLOADER = require('../middleware/storage');
const { IS_AUTHENTICATED } = require('../middleware/auth');
const router = Router();

router.post('/upload',UPLOADER,upload);
router.post('/download',IS_AUTHENTICATED,download);

module.exports = router;