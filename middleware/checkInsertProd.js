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
        errors.nameProduct = "Name product can't be empty!";
    }

    if(validator.isEmpty(price)) {
        errors.price = "Price can't be empty!";
    } else if(!validator.isFloat(price, { min: 1 })) {
        errors.price = "Price must be positive!";
    }

    if(validator.isEmpty(discount)) {
        errors.discount = "Discount can't be empty!!";
    } else if(!validator.isFloat(discount, { min: 0 })) {
        errors.discount = "Discount must be positive!";
    } else if(!validator.isFloat(discount, { min: 0, max: 100 })) {
        errors.discount = "Discount must be from 0 to 100!";
    }

    if(validator.isEmpty(author)) {
        errors.author = "Author can't be empty!!";
    }

    if(validator.isEmpty(isbn)) {
        errors.isbn = "ISBN can't be empty!";
    }

    if(validator.isEmpty(year)) {
        errors.year = "Year can't be empty!!";
    }

    if(validator.isEmpty(description)) {
        errors.description = "Description can't be empty!!";
    }

    if(!lad.isEmpty(errors)) {
        return res.render('admin/insertProduct', { errors: errors });
    }

    return next();
}