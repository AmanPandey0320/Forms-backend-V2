const { Router } = require('express');
const router = Router();

router.use('/auth',require('./router/auth'));
router.use('/form',require('./router/forms'));
router.use('/storage',require('./router/storage'));

module.exports = router;