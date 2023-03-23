const express = require('express');
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const siteRouter = require('./routers/site/siteRouter');
const accountRouter = require('./routers/account/accountRouter');
const adminRouter = require('./routers/admin/adminRouter');
const mongoose = require('mongoose');

const app = express();
const port = 5121;

// Khai báo sử dụng body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Khai báo sử dụng ejs, public
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));

// Khai báo sử dụng session
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    // store: new FileStore(),
    resave: false
}));


// Sử dụng middleware để lấy session khi người dùng đăng nhập
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Sử dụng router
app.use(accountRouter);
app.use(siteRouter);
app.use(adminRouter);


mongoose.connect("mongodb://127.0.0.1:27017/assNodeJs")
    .then(result => {
        app.listen(port, () => console.log(`Ứng dụng đang chạy với port: ${5121}`));
    })
    .catch(err => console.log(err))