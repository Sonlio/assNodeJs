const express = require('express');
const adminController = require('../../controllers/admin/adminController');
const checkPermission = require('../../middleware/checkPermission');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/images-product');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({storage: storage});

router.get('/admin', checkPermission.checkPermission, adminController.getAllProduct);
router.get('/admin/insertProduct', checkPermission.checkPermission, adminController.getInsertProduct);
router.post('/admin/insertProduct', (upload.single('image')), adminController.inSertProduct);
router.get('/admin/editProduct/:idProd', checkPermission.checkPermission, adminController.getUpdateProduct);
router.post('/admin/editProduct', (upload.single('image')), adminController.updateProduct);
router.get('/admin/deleteProduct/:idProd', checkPermission.checkPermission, adminController.deleteProduct);
router.get('/admin/listUser', checkPermission.checkPermission, adminController.getAllUser);
router.get('/admin/deleteUser/:idUser', adminController.deleteUser);

module.exports = router;