const { Router } = require('express');
const { create, getall, getone } = require('../controller/forms');
const { IS_AUTHENTICATED } = require('../middleware/auth');
const router = Router();

router.post('/create',IS_AUTHENTICATED,create);
router.post('/getall',IS_AUTHENTICATED,getall);
router.post('/getone',IS_AUTHENTICATED,getone);

module.exports = router;