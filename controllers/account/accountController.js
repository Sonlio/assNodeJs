const nodemailer = require('nodemailer');
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

exports.getForgotPassword = (req, res, next) => {
    res.render('account/forgotPassword');
}

exports.forgotPassword = async (req, res, next) => {
   try {
        const email = req.body.email;
        const user = await Users.findOne({email: email});
        if(!user) {
            res.render('account/forgotPassword', {message: `Email doesn't exist`});
        }

        const codeResetPassword = Math.floor(Math.random() * (50000 - 10000 + 1) + 10000);


        let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: 'levansonsvqb@gmail.com',
            pass: 'lmwifboipvesbvcj',
        },
        });
        
        const mailOptions = {
            from: 'levansonsvqb@gmail.com',
            to: `${email}`,
            subject: 'OTP reset password',
            text: `Your OPT to reset password: ${codeResetPassword}`,
        };
        
        await transporter.sendMail(mailOptions);

        req.session.userForgotSession = {
            userId: user._id,
            codeResetPassword: codeResetPassword
        }

        return res.render('account/resetPassword');
   } catch (e) {
        console.log(e);
   }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const codeResetPassword = req.body.codeResetPassword;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const userForgot = req.session.userForgotSession;

        if(!userForgot || userForgot.codeResetPassword !== parseFloat(codeResetPassword)) {
            return res.render('account/resetPassword', {errCodeResetPassword: 'Wrong OTP!'})
        }

        if(password.length < 6) {
            return res.render('account/resetPassword', {errPassword: `Password at least 6 characters!!`})
        }

        if(password !== confirmPassword) {
            return res.render('account/resetPassword', {errConfirmPassword: `Password doesn't match!`})
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const user = await Users.findOne({_id: userForgot.userId});
        user.password = hashPassword;
        await user.save();
        req.session.userForgotSession = null;

        return res.render('account/login');

    } catch (e) {
        console.log(e);
    }
}

exports.getChangePassword = (req, res, next) => {
    res.render('account/changePassword');
}

exports.changePassword = async (req, res, next) => {
    try {
        const user = await Users.findOne({_id: req.session.user._id});
        const newPassword = req.body.newPassword;

        const hashPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashPassword;
        await user.save();

        return res.redirect('/account/login');

    } catch (err) {
        return res.render('err/404');
    }
}