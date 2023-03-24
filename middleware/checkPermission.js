const Users = require('../models/usersModel');

exports.checkPermission = (req, res, next) => {
    const userExist = req.session.user;
    if(!userExist) {
        return res.redirect('/account/login');
    }
    
    Users.findById(userExist._id)
        .then((user) => {
            if(user.typeUser === 1) {
                next();
            } else {
                return res.render('err/nonePermission')
            }
        })
}