const express = require('express');
const adminController = require('../../controllers/admin/adminController');
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

router.get('/admin', adminController.getAllProduct);
router.get('/admin/insertProduct', adminController.getInsertProduct);
router.post('/admin/insertProduct', (upload.single('image')), adminController.inSertProduct);
router.get('/admin/editProduct/:idProd', adminController.getUpdateProduct);
router.post('/admin/editProduct', (upload.single('image')), adminController.updateProduct);
router.get('/admin/deleteProduct/:idProd', adminController.deleteProduct);

module.exports = router;