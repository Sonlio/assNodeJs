const Products = require('../../models/productsModel');
const Comments = require('../../models/commentsModel');
const Users = require('../../models/usersModel');

exports.getAllProduct = (req, res, next) => {
    Products
        .find()
        .then(result => {
            res.render('site/home', {
                products: result
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.getProductById = (req, res, next) => {
    const idProd = req.params.idProd;
    const userExist = req.session.user;

    Products
        .findById(idProd)
        .then(product => {
            return Promise.all([product, Comments.find({productId: idProd})]);
        })
        .then(result => {
            const product = result[0];
            const comments = result[1];

            const userComment = comments.map(comment => {
                return Users.findOne({ _id: comment.userId })
                  .then(user => {
                    return {
                        comment: comment,
                        userComment: user
                    };
                  });
              });

            return Promise.all(userComment)
            .then(userComment => {
                res.render('site/detail', {
                    product: product,
                    comments: userComment,
                    userExist: userExist 
                })
            })
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.insertComment = (req, res, next) => {
    const idProd = req.params.idProd;
    const content = req.body.content
    const userId = req.session.user._id;
    const rating = req.body.star;

    const insertComment = new Comments({
        rating: rating,
        content: content,
        dateComment: new Date().toISOString(),
        userId: userId,
        productId: idProd
    })

    // Tăng reviewCount lên 1
    Products
        .findById(idProd)
        .then(prod => {
            prod.reviewCount += 1;
            return prod.save();
        })
        .then(result => {
            return insertComment.save()
        })
        .then(result => {
            res.redirect('/products/detail/'+idProd);
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err);
        })
}

exports.deleteComment = (req, res, next) => {
    const idComment = req.params.idComment;
    let productId;
    Comments
        .findById(idComment)
        .then(comment => {
            productId = comment.productId;
            return Products.findById(productId) 
        })
        .then(product => {
            product.reviewCount -= 1;
            return product.save();
        })
        .then(result => {
            return Comments.findByIdAndRemove(idComment);
        })
        .then(result => {
            res.redirect('/products/detail/'+productId);
        })
        .catch(err => console.log(err))
}