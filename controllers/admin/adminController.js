const Products = require('../../models/productsModel');
const Comments = require('../../models/commentsModel');
const Users = require('../../models/usersModel');

exports.getAllProduct = (req, res, next) => {
    Products
        .find()
        .then(result => {
            return Promise.all([result, Comments.find(), Users.find()])
            // return Comments.find().then(comments => {
            //     res.render('admin/index', {
            //         products: result,
            //         comments: comments
            //     })
            // })
        })
        .then(result => {
            const products = result[0];
            const comments = result[1];
            const users = result[2];

            res.render('admin/index', {
                products: products,
                comments: comments,
                users: users
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.getInsertProduct = (req, res, next) => { 
    res.render('admin/insertProduct')
}

exports.inSertProduct = (req, res, next) => {
    const nameProduct = req.body.nameProduct;
    const price = req.body.price;
    const discount = req.body.discount;
    const author = req.body.author;
    const isbn = req.body.isbn;
    const year = req.body.year;
    const description = req.body.description;
    const file = req.file;
    const fileName = file.filename;

    const insertProduct = new Products({nameProduct: nameProduct, price: price, discount: discount, author: author, isbn: isbn, year: year, image: fileName, description: description});

    insertProduct
        .save()
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

let idProd;
exports.getUpdateProduct = (req, res, next) => {
    idProd = req.params.idProd;
    
    Products
        .findById(idProd)
        .then(product => {
            if(!product) {
                const error = new Error("Không tìm thấy sản phẩm!");
                error.statusCode = 404;
                throw error;
            }
            res.render('admin/editProduct', {
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

exports.updateProduct = (req, res, next) => {
    const nameProduct = req.body.nameProduct;
    const price = req.body.price;
    const discount = req.body.discount;
    const author = req.body.author;
    const isbn = req.body.isbn;
    const year = req.body.year;
    const description = req.body.description;
    const file = req.file;
    const fileName = file.filename;

    Products.findById(idProd)
        .then(product => {
            if(!product) {
                const error = new Error("Không tìm thấy sản phẩm!");
                error.statusCode = 404;
                throw error;
            }
            product.nameProduct = nameProduct;
            product.price = price;
            product.discount = discount;
            product.author = author;
            product.isbn = isbn;
            product.year = year;
            product.description = description;
            product.image = fileName;
            product.reviewCount = 19;
            product.averageScore = 20
            return product.save();
        })
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.deleteProduct = (req, res, next) => {
    const idProd = req.params.idProd;

    Products
        .findById(idProd)
        .then(product => {
            if(!product) {
                const error = new Error("Không tìm thấy sản phẩm!");
                error.statusCode = 404;
                throw error;
            }
            return Products.findByIdAndRemove(idProd);
        })
        .then(result => {
            res.redirect('/admin')
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}