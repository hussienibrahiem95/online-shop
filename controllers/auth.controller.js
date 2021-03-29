const authModel = require('../models/auth.model')
const validationResult = require("express-validator").validationResult;

exports.getSignup = (req, res, next) => {
    res.render('signup', {
        authError: req.flash("authError")[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        pageTitle: 'SignUp',
    });
}
exports.postSignup = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel.createNewUser(req.body.username, req.body.email, req.body.password).then(() => {
            res.redirect('login');
        }).catch(err => {
            req.flash('authError', err)
            res.redirect('signup');
        })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/signup')
    }
}
exports.getLogin = (req, res, next) => {
    res.render('login', {
        loginError: req.flash('loginError')[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Log In',
    });
}
exports.postLogin = (req, res, next) => {

    if (validationResult(req).isEmpty()) {
        authModel
            .getUser(req.body.email, req.body.password)
            .then((id) => {
                console.log('id ' + id[0]);
                req.session.userId = id[0];
                req.session.userName = id[1];
                req.session.isAdmin = id[2];
                res.redirect('/');
            }).catch(err => {
                req.flash('loginError', err);
                res.redirect('/login');
            })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/login');
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}