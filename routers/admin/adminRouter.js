const express = require('express');
const adminController = require('../../controllers/admin/adminController');
const checkPermission = require('../../middleware/checkPermission');
const checkInsertProd = require('../../middleware/checkInsertProd');
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
router.post('/admin/insertProduct', (upload.single('image')), checkInsertProd.checkInsertProd, adminController.inSertProduct);
router.get('/admin/editProduct/:idProd', checkPermission.checkPermission, adminController.getUpdateProduct);
router.post('/admin/editProduct', (upload.single('image')), adminController.updateProduct);
router.get('/admin/deleteProduct/:idProd', checkPermission.checkPermission, adminController.deleteProduct);
router.get('/admin/listUser', checkPermission.checkPermission, adminController.getAllUser);
router.get('/admin/editUser/:idUser', checkPermission.checkPermission, adminController.getUpdateUser);
router.post('/admin/editUser', adminController.postUpdateUser);
router.get('/admin/listComment', checkPermission.checkPermission, adminController.listComment);
router.get('/admin/detailComment/:idProd', checkPermission.checkPermission, adminController.detailComment);
router.get('/admin/detailComment/deleteComment/:idComment', checkPermission.checkPermission, adminController.deleteComment);

module.exports = router;