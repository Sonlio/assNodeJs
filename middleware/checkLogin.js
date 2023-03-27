const lad = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Users = require('../models/usersModel');

exports.checkLogin = async (req, res, next) => {

    let errors = {};
    
    const email = lad.get(req.body, "email", "");
    const password = lad.get(req.body, "password", "");

    if(validator.isEmpty(email)) {
        errors.email = "Email không được để trống!";
    } else {
        const existEmail = await Users.findOne({ email: email });
        if (!existEmail) {
            errors.email = "Email không tồn tại!";
        }
    }

    if(validator.isEmpty(password)) {
        errors.password = "Password không được để trống!";
    } else {
        const user = await Users.findOne({email: email});
        if(user) {
            const comparePass = await bcrypt.compare(password, user.password)
            if(!comparePass) {
                errors.password = "Password không trùng khớp!"
            }
        }
    }

    if(!lad.isEmpty(errors)) {
        return res.render('account/login', { errors: errors });
    }

    return next();
}