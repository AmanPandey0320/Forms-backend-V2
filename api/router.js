const { Router } = require('express');
const router = Router();

router.use('/auth',require('./router/auth'));

module.exports = router;