const lad = require('lodash');
const validator = require('validator');

exports.checkInsertProd = async (req, res, next) => {

    let errors = {};
    
    const nameProduct = lad.get(req.body, "nameProduct", "");
    const price = lad.get(req.body, "price", "");
    const discount = lad.get(req.body, "discount", "");
    const author = lad.get(req.body, "author", "");
    const isbn = lad.get(req.body, "isbn", "");
    const year = lad.get(req.body, "year", "");
    const description = lad.get(req.body, "description", "");
    
    if(validator.isEmpty(nameProduct)) {
        errors.nameProduct = "Name product không được để trống!";
    }

    if(validator.isEmpty(price)) {
        errors.price = "Price không được để trống!";
    } else if(!validator.isFloat(price, { min: 1 })) {
        errors.price = "Price phải là số dương!";
    }

    if(validator.isEmpty(discount)) {
        errors.discount = "Discount không được để trống!!";
    } else if(!validator.isFloat(discount, { min: 1 })) {
        errors.discount = "Discount phải là số dương!";
    } else if(!validator.isFloat(discount, { min: 0, max: 100 })) {
        errors.discount = "Discount phải từ 0 --> 100!";
    }

    if(validator.isEmpty(author)) {
        errors.author = "Author không được để trống!!";
    }

    if(validator.isEmpty(isbn)) {
        errors.isbn = "ISBN không được để trống!";
    }

    if(validator.isEmpty(year)) {
        errors.year = "Year không được để trống!!";
    }

    if(validator.isEmpty(description)) {
        errors.description = "Description không được để trống!!";
    }

    if(!lad.isEmpty(errors)) {
        return res.render('admin/insertProduct', { errors: errors });
    }

    return next();
}