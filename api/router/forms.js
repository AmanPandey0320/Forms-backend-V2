const { Router } = require('express');
const { create } = require('../controller/forms');
const { IS_AUTHENTICATED } = require('../middleware/auth');
const router = Router();

router.post('/create',IS_AUTHENTICATED,create);

module.exports = router;