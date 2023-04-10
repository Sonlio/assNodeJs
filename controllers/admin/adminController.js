const Products = require('../../models/productsModel');
const Comments = require('../../models/commentsModel');
const Users = require('../../models/usersModel');

exports.getAllProduct = async (req, res, next) => {

    try {
        const products = await Products.find();
        const countComment = await Comments.count({});
        const countUser = await Users.count({});

        return res.render('admin/index', {
            products: products,
            countComment: countComment,
            countUser: countUser,
        })
    } catch (err) {
        return res.render('err/404');
    }
}

exports.getInsertProduct = (req, res, next) => {
    res.render('admin/insertProduct')
}

exports.inSertProduct = async (req, res, next) => {
    try {
        const file = req.file;
        const fileName = file.filename;

        await Products.create({
            nameProduct: req.body.nameProduct,
            price: req.body.price,
            discount: req.body.discount,
            author: req.body.author,
            isbn: req.body.isbn,
            year: req.body.year,
            image: fileName,
            description: req.body.description
        })

        return res.redirect('/admin');
    } catch (err) {
        return res.render('err/404');
    }
}

let idProd;
exports.getUpdateProduct = async (req, res, next) => {
    idProd = req.params.idProd;

    try {
        const product = await Products.findById(idProd);

        return res.render('admin/editProduct', {
            product: product
        })

    } catch (err) {
        return res.render('err/404');
    }
}

exports.updateProduct = async (req, res, next) => {
    const file = req.file;
    const fileName = file.filename;

    try {
        const product = await Products.findById(idProd);
        
        await Products.updateOne({_id: idProd}, {
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

        return res.redirect('/admin');

    } catch (err) {
        return res.render('err/404');
    }
}

exports.deleteProduct = async (req, res, next) => {
    const idProd = req.params.idProd;

    try {
        await Products.findByIdAndRemove(idProd);
        await Comments.deleteMany({productId: idProd});

        return res.redirect('/admin');
    } catch (err) {
        return res.render('err/404');
    }
}

exports.getAllUser = async (req, res, next) => {
    try {
        const users = await Users.find();
        return res.render('admin/listUser', {
            users: users
        });

    } catch (err) {
        return res.render('err/404');
    }
}

let idUser;
exports.getUpdateUser = async (req, res, next) => {
    idUser = req.params.idUser;
    try {
        const user = await Users.findOne({_id: idUser});
        return res.render('admin/editUser', {user: user});

    } catch (err) {
        return res.render('err/404');
    }
}

exports.postUpdateUser = async (req, res, next) => {
    try {
        await Users.updateOne({_id: idUser}, {
            typeUser: req.body.typeUser
        })
        return res.redirect('/admin/listUser');

    } catch (err) {
        return res.render('err/404');
    }
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
        return res.render('err/404');
    }
}

exports.detailComment = async (req, res, next) => {
    const idProd = req.params.idProd;

    try {
        const comments = await Comments.find({productId: idProd}).populate('userId').sort({ dateComment: -1 });
        res.render('admin/detailComment', {comments: comments})

    } catch (err) {
        return res.render('err/404');
    }
}

exports.deleteComment = async (req, res, next) => {
    const idComment = req.params.idComment;

    try {
        // Lấy product tại comment đó để cập nhật lại reviewCount
        const Comment = await Comments.findOne({_id: idComment});
        const productComment = await Products.findOne({_id: Comment.productId});
        const idProduct = productComment._id;

        // Xóa comment
        await Comments.findByIdAndRemove(idComment)
        
        // Cập nhật lại reviewCount và averageScore trong bảng product
        productComment.reviewCount -= 1;
        const comments = await Comments.find({productId: idProduct});
        const reviewCount = comments.length;
        const totalRate = comments.reduce((total, comment) => total + comment.rating, 0);
        const averageScore = reviewCount > 0 ? Math.round(totalRate / reviewCount) : 0;
        productComment.averageScore = averageScore;

        await productComment.save();
        

        // Kiểm tra nếu còn comment thì vẫn ở lại trang detail comment nếu không thì redirect về trang list comment
        const checkComment = await Comments.find({productId: idProduct});
        if(checkComment.length > 0) {
            return res.redirect(`/admin/detailComment/${idProduct.toString()}`);
            
        }else {
            return res.redirect('/admin/listComment');
        }

    } catch (err) {
        return res.render('err/404');
    }
}