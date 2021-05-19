const { Router } = require('express');
const { CREATE_TEMPLATE,DELETE_TEMPLATE,READ_TEMPLATE,UPDATE_TEMPLATE } = require('../Controller/template');
const { IS_ADMIN } = require('./helpers/user');
const route = Router();

route.post('/create',IS_ADMIN,CREATE_TEMPLATE);
route.post('/read',IS_ADMIN,READ_TEMPLATE);
route.post('/update',IS_ADMIN,UPDATE_TEMPLATE);
route.post('/delete',IS_ADMIN,DELETE_TEMPLATE);

module.exports = route;