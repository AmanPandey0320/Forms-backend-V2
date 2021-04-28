const  { Router } = require('express');
const router = Router();

router.use('/auth',require('./user'));
router.use('/logs',require('./logs'));

module.exports = router;