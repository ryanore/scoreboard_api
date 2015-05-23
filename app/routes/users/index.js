var express = require('express');
var router = express.Router();
var user = require('./userController.js');
var expressJwt = require('express-jwt');

router.get('/api/v1/users', user.list.bind(user));

router.get('/api/v1/user/:id', user.getOne.bind(user));

router.post('/api/v1/user/', user.create.bind(user));

router.put('/api/v1/user/:id', expressJwt, user.update.bind(user));

router.delete('/api/v1/user/:id', expressJwt, user.delete.bind(user));

module.exports = router;