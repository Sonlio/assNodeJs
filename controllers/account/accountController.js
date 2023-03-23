const Users = require('../../models/usersModel');
const bcrypt = require('bcryptjs');

exports.getRegister = (req, res, next) => {
    res.render('account/register', {message: ''});
}

exports.register = (req, res, next) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const typeUser = req.body.typeUser;

    Users.findOne({email: email})
        .then(user => {
            if(user) {
                return res.render('account/register', {message: "Email đã tồn tại, vui lòng nhập email khác!"});
            }
            return bcrypt.hash(password, 12)
        })
        .then(hashedPassword => {
            const insertUser = new Users({
                fullName: fullName, 
                email: email, 
                password: hashedPassword, 
                phoneNumber: phoneNumber, 
                address: address, 
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
    res.render('account/login', {message: ''});
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.render('account/login', {message: "Email không tồn tại!"});
            }

            return Promise.all([bcrypt.compare(password, user.password), user])
        })
        .then(result => {
            const isMatch = result[0];
            const user = result[1];

            if(!isMatch) {
                return res.render('account/login', {message: "Password không trùng khớp!"});
            }
            req.session.user = user;
            return res.redirect('/');
        })
        .catch(err => console.log(err))
}

exports.logout = (req, res, next) => {
    req.session.destroy();
    return res.redirect('/account/login');
}