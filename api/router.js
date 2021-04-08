const { Router } = require('express');
const router = Router();

router.use('/auth',require('./router/auth'));
router.use('/form',require('./router/forms'));

module.exports = router;