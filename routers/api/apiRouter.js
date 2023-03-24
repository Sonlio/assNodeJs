const express = require('express');
const apiController = require('../../controllers/api/apiController');
const router = express.Router();

router.get('/api/products', apiController.getAllProduct);
router.get('/api/products/:isbn', apiController.getByIsbn);

module.exports = router;