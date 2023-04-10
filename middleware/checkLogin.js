const lad = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Users = require('../models/usersModel');

exports.checkLogin = async (req, res, next) => {

    let errors = {};
    
    const email = lad.get(req.body, "email", "");
    const password = lad.get(req.body, "password", "");

    if(validator.isEmpty(email)) {
        errors.email = "Email can't be empty!";
    } else {
        const existEmail = await Users.findOne({ email: email });
        if (!existEmail) {
            errors.email = "Email doesn't exist!";
        }
    }

    if(validator.isEmpty(password)) {
        errors.password = "Password can't be empty!";
    } else {
        const user = await Users.findOne({email: email});
        if(user) {
            const comparePass = await bcrypt.compare(password, user.password)
            if(!comparePass) {
                errors.password = "Wrong password!"
            }
        }
    }

    if(!lad.isEmpty(errors)) {
        return res.render('account/login', { errors: errors });
    }

    return next();
}