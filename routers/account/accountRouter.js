const express = require('express');
const accountController = require('../../controllers/account/accountController');
const router = express.Router();

router.get('/account/register', accountController.getRegister);
router.post('/account/register', accountController.register);
router.get('/account/login', accountController.getLogin);
router.post('/account/login', accountController.login);
router.get('/account/logout', accountController.logout);

module.exports = router;