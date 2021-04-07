const { Router } = require('express');
const { sign_up, sign_in } = require('../controller/auth');
const { IS_AUTHENTICATED } = require('../middleware/auth');
const router = Router();

router.post('/signup',sign_up);
router.post('/signin',sign_in);

module.exports = router;