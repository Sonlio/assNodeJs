const Products = require('../../models/productsModel');
const Comments = require('../../models/commentsModel');

exports.getAllProduct = async (req, res, next) => {

    try {
        const products = await Products.find();
        return res.render('site/home', {
            products: products
        })

    } catch (err) {
        return res.render('err/404')
    }
}

exports.getProductById = async (req, res, next) => {
    const idProd = req.params.idProd;
    // const userExist = req.session.user;

    try {
        const product = await Products.findById(idProd);
        if(!product) {
            return res.render('err/404')
        } else {
            const comments = await Comments.find({productId: idProd}).sort({dateComment: -1}).populate('userId');
    
            return res.render('site/detail', {
                product: product,
                comments: comments,
                // userExist: userExist 
            })
        }

    } catch (err) {
        return res.render('err/404')
    }

}

exports.productSearch = async (req, res, next) => {
    const dataSearch = req.body.search;
    
    try {
        const productFind = await Products.find({$or: [
            {nameProduct: { $regex: new RegExp(dataSearch, 'i')}},
            {author: { $regex: new RegExp(dataSearch, 'i')}}
        ]})
    
        return res.render('site/productOfSearch', {
            products: productFind
        })
    } catch (err) {
        return res.render('err/404');
    }
}

exports.insertComment = async (req, res, next) => {
    const userId = req.session.user._id;
    const productId = req.params.idProd;

    try {
        const commentOfUser = await Comments.find({userId: userId, productId: productId});

        if(commentOfUser.length >= 3) {
            return res.send(`<script>alert("Don't comment more than 3 times!");window.history.back();</script>`);
            
        } else {
            await Comments.create({
                rating: req.body.star,
                content: req.body.content,
                dateComment: new Date().toISOString(),
                userId: userId,
                productId: productId
            })

            const findProduct = await Products.findById(productId);
            findProduct.reviewCount += 1;
            const comments = await Comments.find({productId: productId});
            const reviewCount = comments.length;
            const totalRate = comments.reduce((total, comment) => total + comment.rating, 0);
            const averageScore = Math.round(totalRate / reviewCount);
            findProduct.averageScore = averageScore;

            await findProduct.save();

            return res.redirect(`/products/detail/${productId}`);
        }
    } catch(err) {
        return res.render('err/404')
    }
}

exports.deleteComment = async (req, res, next) => {
    const idComment = req.params.idComment;

    try {
        const commentDelete = await Comments.findById(idComment);
        const idProduct = commentDelete.productId;
        const findProduct = await Products.findById(idProduct);
        await Comments.findByIdAndRemove(idComment);
        findProduct.reviewCount -= 1;

        const comments = await Comments.find({productId: idProduct});
        const reviewCount = comments.length;
        const totalRate = comments.reduce((total, comment) => total + comment.rating, 0);
        const averageScore = reviewCount > 0 ? Math.round(totalRate / reviewCount) : 0;
        findProduct.averageScore = averageScore;

        await findProduct.save();

        return res.redirect(`/products/detail/${idProduct}`);
        
    } catch (err) {
        // return res.render('err/404');
        console.log(err);
    }
}

exports.aboutPage = (req, res, next) => {
    return res.render('site/about');
}

exports.contactPage = (req, res, next) => {
    return res.render('site/contact');
}