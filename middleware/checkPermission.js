const Users = require('../models/usersModel');

exports.checkPermission = async (req, res, next) => {
    const userExist = req.session.user;
    if (!userExist) {
        return res.redirect('/account/login');
    }

    try {
        const user = await Users.findById(userExist._id);
        if(user.typeUser === 1) {
            next();
            
        } else {
            return res.render('err/nonePermission')
        }

    } catch (err) {
        console.log(err);
    }
}