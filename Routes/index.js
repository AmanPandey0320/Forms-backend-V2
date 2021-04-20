const  { Router } = require('express');
const router = Router();

router.use('/auth',require('./user'));

module.exports = router;