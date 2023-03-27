const lad = require('lodash');
const validator = require('validator');
const Users = require('../models/usersModel');

exports.checkRegister = async (req, res, next) => {

    let errors = {};
    
    const fullName = lad.get(req.body, "fullName", "");
    const email = lad.get(req.body, "email", "");
    const password = lad.get(req.body, "password", "");
    const phoneNumber = lad.get(req.body, "phoneNumber", "");
    const address = lad.get(req.body, "address", "");
    
    if(validator.isEmpty(fullName)) {
        errors.fullName = "Name không được để trống!";
    }

    if(validator.isEmpty(email)) {
        errors.email = "Email không được để trống!";
    } else {
        const existEmail = await Users.findOne({ email: email });
        if (existEmail) {
            errors.email = "Email đã được sử dụng!";
        }
    }

    if(validator.isEmpty(password)) {
        errors.password = "Password không được để trống!";
    } else if(!validator.isLength(password, {min: 6})) {
        errors.password = "Password ít nhất 6 ký tự";
    }

    if(validator.isEmpty(phoneNumber)) {
        errors.phoneNumber = "Phone number không được để trống!";
    } else if(!validator.isInt(phoneNumber, { min: 1 })) {
        errors.phoneNumber = "Phone number không đúng định dạng!";
    }

    if(validator.isEmpty(address)) {
        errors.address = "Address không được để trống!";
    }

    if(!lad.isEmpty(errors)) {
        return res.render('account/register', { errors: errors });
    }

    return next();
}