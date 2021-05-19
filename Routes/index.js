const  { Router } = require('express');
const router = Router();

router.use('/auth',require('./user'));
router.use('/logs',require('./logs'));
router.use('/template',require('./template'));

module.exports = router;