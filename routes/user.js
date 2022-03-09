const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');

router.post('/register', userValidationRules.createRules, userController.register);

router.post('/login', userValidationRules.loginRules, userController.login);

router.post('/refresh', userController.refresh);


module.exports = router;
