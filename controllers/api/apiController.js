const Products = require('../../models/productsModel');

exports.getAllProduct = (req, res, next) => {
    Products
        .find()
        .then(products => {
            res.status(200).json({
                message: "Lấy thành công tất cả sản phẩm!",
                products: products
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.getByIsbn = (req, res, next) => {
    const isbn = req.params.isbn;

    Products.findOne({isbn: isbn})
        .then(product => {
            if(!product) {
                const error = new Error('Không tìm thấy sản phẩm!');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: "Đã tìm thấy sản phẩm!",
                product: product
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}