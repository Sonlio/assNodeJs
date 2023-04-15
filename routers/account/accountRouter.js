const express = require('express');
const accountController = require('../../controllers/account/accountController');
const checkRegister = require('../../middleware/checkRegister');
const checkLogin = require('../../middleware/checkLogin');
const checkChangePass = require('../../middleware/checkChangePassword');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/images-user');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({storage: storage});

router.get('/account/register', accountController.getRegister);
router.post('/account/register', (upload.single("image")), checkRegister.checkRegister, accountController.register);
router.get('/account/login', accountController.getLogin); 
router.post('/account/login', checkLogin.checkLogin, accountController.login);
router.get('/account/logout', accountController.logout);
router.get('/account/forgot-password', accountController.getForgotPassword);
router.post('/account/forgot-password', accountController.forgotPassword);
router.post('/account/reset-password', accountController.resetPassword);
router.get('/account/change-password', accountController.getChangePassword);
router.post('/account/change-password', checkChangePass.checkChangePassword, accountController.changePassword);

module.exports = router;