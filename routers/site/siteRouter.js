const express = require('express');
const siteController = require('../../controllers/site/siteController');
const router = express.Router();

router.get('/', siteController.getAllProduct);
router.get('/products/detail/:idProd', siteController.getProductById);
router.post('/products/detail/:idProd', siteController.insertComment);
router.get('/products/detail/deleteComment/:idComment', siteController.deleteComment);
router.post('/products/search', siteController.productSearch);

module.exports = router;