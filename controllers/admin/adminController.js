const Products = require('../../models/productsModel');
const Comments = require('../../models/commentsModel');
const Users = require('../../models/usersModel');

exports.getAllProduct = async (req, res, next) => {
    const result = await Comments.aggregate([{
        $group: {
            _id: "$productId",
            totalRate: {
                $sum: "$rating"
            }
        }
    }, ]);

    const totalRatings = [];
    result.forEach(item => {
        totalRatings.push({
            id: item._id.toString(),
            totalRate: item.totalRate
        })
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
            if (!err.statusCode) {
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

    const insertProduct = new Products({
        nameProduct: nameProduct,
        price: price,
        discount: discount,
        author: author,
        isbn: isbn,
        year: year,
        image: fileName,
        description: description
    });

    insertProduct
        .save()
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            if (!err.statusCode) {
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
            if (!product) {
                const error = new Error("Không tìm thấy sản phẩm!");
                error.statusCode = 404;
                throw error;
            }
            res.render('admin/editProduct', {
                product: product
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.updateProduct = (req, res, next) => {
    const file = req.file;
    const fileName = file.filename;

    Products.findById(idProd)
        .then(product => {
            if (!product) {
                const error = new Error("Không tìm thấy sản phẩm!");
                error.statusCode = 404;
                throw error;
            }

            return Products.updateOne({_id: idProd}, {
                nameProduct: req.body.nameProduct,
                price: req.body.price,
                discount: req.body.discount,
                author: req.body.author,
                isbn: req.body.isbn,
                year: req.body.year,
                description: req.body.description,
                image: fileName,
                reviewCount: product.reviewCount,
                averageScore: product.averageScore,
            });
        })
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            if (!err.statusCode) {
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
            if (!product) {
                const error = new Error("Không tìm thấy sản phẩm!");
                error.statusCode = 404;
                throw error;
            }
            return Products.findByIdAndRemove(idProd);
        })
        .then(() => {
            return Comments.deleteMany({
                productId: idProd
            })
        })
        .then(result => {
            res.redirect('/admin')
        })
        .catch(err => {
            if (!err.statusCode) {
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

exports.listComment = async (req, res, next) => {
    try {
        // Lấy tất cả các id sản phẩm có trong comment
        const idProductOfComment = await Comments.aggregate([{
            $group: {
                _id: "$productId"
            }
        }, ]);
    
        // Tạo biến để lưu lại các sản phẩm đó
        const productComments = [];

        // Tìm tất cả sản phẩm theo id đó
        for (let i = 0; i < idProductOfComment.length; i++) {
            const idProduct = idProductOfComment[i]._id.toString();
            const product = await Products.findOne({ _id: idProduct });
            productComments.push(product);
        }

        return res.render('admin/listComment', {productComments: productComments});

    } catch(err) {
        console.log(err);
    }
}

exports.detailComment = async (req, res, next) => {
    const idProd = req.params.idProd;
    const comments = await Comments.find({productId: idProd}).populate('userId').sort({ dateComment: -1 });
 
    res.render('admin/detailComment', {comments: comments})
}

exports.deleteComment = async (req, res, next) => {
    const idComment = req.params.idComment;

    try {
        // Lấy product tại comment đó để cập nhật lại reviewCount
        const Comment = await Comments.findOne({_id: idComment});
        const productComment = await Products.findOne({_id: Comment.productId});
        const idProduct = productComment._id;

        // Cập nhật lại reviewCount trong bảng product
        productComment.reviewCount -= 1;
        await productComment.save();
        
        // Xóa comment
        await Comments.findByIdAndRemove(idComment)

        // Kiểm tra nếu còn comment
        const checkComment = await Comments.find({productId: idProduct});
        if(checkComment.length > 0) {
            return res.redirect(`/admin/detailComment/${idProduct.toString()}`);
            
        }else {
            return res.redirect('/admin/listComment');
        }

    } catch (err) {
        console.log(err);
    }
}