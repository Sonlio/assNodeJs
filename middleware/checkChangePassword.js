const lad = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');

exports.checkChangePassword = async (req, res, next) => {

    let errors = {};

    const user = req.session.user;
    
    const oldPassword = lad.get(req.body, "oldPassword", "");
    const newPassword = lad.get(req.body, "newPassword", "");
    const confirmNewPassword = lad.get(req.body, "confirmNewPassword", "");

    if(validator.isEmpty(oldPassword)) {
        errors.oldPassword = "Password can't be empty!";
    } else {
        const comparePass = await bcrypt.compare(oldPassword, user.password);
        if(!comparePass) {
            errors.oldPassword = "Wrong password!"
        }
    }

    if(validator.isEmpty(newPassword)) {
        errors.newPassword = "New password can't be empty!";
    } else if(!validator.isLength(newPassword, {min: 6})) {
        errors.newPassword = "New password at least 6 characters!";
    }

    if(validator.isEmpty(confirmNewPassword)) {
        errors.confirmNewPassword = "Confirm new password can't be empty!";
    } else if(!validator.equals(newPassword, confirmNewPassword)) {
        errors.confirmNewPassword = "Confirm password doesn't match!";
    }

    if(!lad.isEmpty(errors)) {
        return res.render('account/changePassword', { errors: errors });
    }

    return next();
}