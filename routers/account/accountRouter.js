const express = require('express');
const accountController = require('../../controllers/account/accountController');
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
router.post('/account/register', (upload.single("image")), accountController.register);
router.get('/account/login', accountController.getLogin);
router.post('/account/login', accountController.login);
router.get('/account/logout', accountController.logout);

module.exports = router;