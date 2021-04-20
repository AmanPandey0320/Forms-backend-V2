const  { Router } = require('express');
const { ADMIN_LOGIN,ADMIN_CREATE } = require('../Controller/user');
const { IS_SUPER } = require('./helpers/user');
const router = Router();

router.post('/login',ADMIN_LOGIN);
router.post('/create',IS_SUPER,ADMIN_CREATE);

module.exports = router;