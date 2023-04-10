const Users = require('../../models/usersModel');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res, next) => {
    res.render('account/register');
}

exports.register = async (req, res, next) => {
    try {
        const file = req.file;
        const fileName = file.filename;
        const hashPassword = await bcrypt.hash(req.body.password, 12);

        Users.create({
            fullName: req.body.fullName, 
            email: req.body.email, 
            password: hashPassword, 
            phoneNumber: req.body.phoneNumber, 
            address: req.body.address,
            image: fileName,
            typeUser: req.body.typeUser
        })

        return res.redirect('/account/login');

    } catch (err) {
        return res.render('err/404');
    }
}

exports.getLogin = (req, res, next) => {
    res.render('account/login');
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await Users.findOne({email: email})
        req.session.user = user;

        return res.redirect('/');
        
    } catch (err) {
        return res.render('err/404');
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy();
    return res.redirect('/account/login');
}