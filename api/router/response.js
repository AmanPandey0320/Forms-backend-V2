const { Router } = require('express');
const { SUBMIT, FETCH_ONE, EDIT_ONE } = require('../controller/response');
const { IS_AUTHENTICATED } = require('../middleware/auth');
const { IS_FORM_VALID, IS_VALID_RESPONSE } = require('../middleware/form');
const router = Router();

router.post('/submit',IS_AUTHENTICATED,IS_FORM_VALID,SUBMIT);
router.post('/fetchone',IS_AUTHENTICATED,IS_VALID_RESPONSE,FETCH_ONE);
router.post('/editone',IS_AUTHENTICATED,IS_VALID_RESPONSE,EDIT_ONE);

module.exports = router;