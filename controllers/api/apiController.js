const Products = require('../../models/productsModel');

exports.getAllProduct = async (req, res, next) => {
    try {
        const products = await Products.find();
        return res.status(200).json({
            message: "Get all product successfully!",
            products: products
        })

    } catch (err) {
        console.log(err);
    }
}

exports.getByIsbn = async (req, res, next) => {
    
    try {
        const isbn = req.params.isbn;
        const product = await Products.findOne({isbn: isbn});
        if(!product) {
            return res.status(404).json({
                message: 'Not found product!',
            })

        } else {
            res.status(200).json({
                message: "Product found successfully!",
                product: product
            })
        }

    } catch (err) {
        console.log(err);
    }
}