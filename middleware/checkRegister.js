const lad = require('lodash');
const validator = require('validator');
const Users = require('../models/usersModel');

exports.checkRegister = async (req, res, next) => {

    let errors = {};
    
    const fullName = lad.get(req.body, "fullName", "");
    const email = lad.get(req.body, "email", "");
    const password = lad.get(req.body, "password", "");
    const confirmPassword = lad.get(req.body, "confirmPassword", "");
    const phoneNumber = lad.get(req.body, "phoneNumber", "");
    const address = lad.get(req.body, "address", "");
    
    if(validator.isEmpty(fullName)) {
        errors.fullName = "Name can't be empty!";
    }

    if(validator.isEmpty(email)) {
        errors.email = "Email can't be empty!";
    } else {
        const existEmail = await Users.findOne({ email: email });
        if (existEmail) {
            errors.email = "Email already exist!";
        }
    }

    if(validator.isEmpty(password)) {
        errors.password = "Password can't be empty!";
    } else if(!validator.isLength(password, {min: 6})) {
        errors.password = "Password at least 6 characters!";
    }

    if(validator.isEmpty(confirmPassword)) {
        errors.confirmPassword = "Confirm Password can't be empty!";
    } else if(!validator.equals(password, confirmPassword)) {
        errors.confirmPassword = "Password doesn't match!";
    }

    if(validator.isEmpty(phoneNumber)) {
        errors.phoneNumber = "Phone number can't be empty!";
    } else if(!validator.isInt(phoneNumber, { min: 1 })) {
        errors.phoneNumber = "Phone number isn't correct format!";
    } else if(!validator.isLength(phoneNumber, {max: 11})) {
        errors.phoneNumber = "Phone number must be 10 or 11 digits!";
    } else if(phoneNumber.toString().substring(0, 1) !== '0' && phoneNumber.toString().substring(0, 2) !== '84') {
        errors.phoneNumber = "Phone number must start with 0 or 84!";
    }

    if(validator.isEmpty(address)) {
        errors.address = "Address can't be empty!";
    }

    if(!lad.isEmpty(errors)) {
        return res.render('account/register', { errors: errors });
    }

    return next();
}