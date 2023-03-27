const Users = require('../../models/usersModel');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res, next) => {
    res.render('account/register');
}

exports.register = (req, res, next) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const typeUser = req.body.typeUser;
    const file = req.file;
    const fileName = file.filename;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const insertUser = new Users({
                fullName: fullName, 
                email: email, 
                password: hashedPassword, 
                phoneNumber: phoneNumber, 
                address: address,
                image: fileName,
                typeUser: typeUser
            });
            return insertUser.save();
        })
        .then(user => {
            res.redirect('/account/login')
        })
        .catch(err => console.log(err))
}

exports.getLogin = (req, res, next) => {
    res.render('account/login');
}

exports.login = (req, res, next) => {
    const email = req.body.email;

    Users.findOne({email: email})
        .then(user => {
            req.session.user = user;
            return res.redirect('/');
        })
        .catch(err => console.log(err))
}

exports.logout = (req, res, next) => {
    req.session.destroy();
    return res.redirect('/account/login');
}