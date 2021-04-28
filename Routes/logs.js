const { Router } = require('express');
const { GET_LOGS } = require('../Controller/logs');
const { IS_ADMIN } = require('./helpers/user');
const router = Router();

router.post('/get',IS_ADMIN,GET_LOGS);

module.exports = router;