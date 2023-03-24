const Products = require('../../models/productsModel');
const Comments = require('../../models/commentsModel');
const Users = require('../../models/usersModel');

exports.getAllProduct = async (req, res, next) => {
    const result = await Comments.aggregate([
        { $group: { _id: "$productId", totalRate: { $sum: "$rating" } } },
    ]);

    const totalRatings = [];
    result.forEach(item => {
        totalRatings.push({id: item._id.toString(), totalRate: item.totalRate})
    })

    Products
        .find()
        .then(async result => {
            const countComment = await Comments.count({});
            const countUser = await Users.count({});

            res.render('admin/index', {
                products: result,
                countComment: countComment,
                countUser: countUser,
                totalRatings: totalRatings
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
        .then(() => {
            return Comments.deleteMany({productId: idProd})

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

exports.getAllUser = (req, res, next) => {
    Users.find()
        .then(users => {
            res.render('admin/listUser', {
                users: users
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deleteUser = (req, res, next) => {
    const idUser = req.params.idUser;

    Users.findByIdAndRemove(idUser)
        .then(() => {
            res.redirect('/admin/listUser')
        })
        .catch(err => console.log(err))
}