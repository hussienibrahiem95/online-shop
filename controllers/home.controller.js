const productsModel = require('../models/products.model')

exports.getHome = (req, res, next) => {
    if (!req.session.userName)
        req.session.userName = 'Guest';
    let category = req.query.category;
    let validCategories = ['clothes', 'phones', 'computers'];
    let dicSelected = {
        'all': '',
        'clothes': '',
        'phones': '',
        'computers': '',
    };
    dicSelected[category] = 'selected';
    let productsPromise;
    if (category && validCategories.includes(category))
        productsPromise = productsModel.getProductsByCategory(category);
    else
        productsPromise = productsModel.getAllProducts();


    productsPromise.then(products => {
        res.render('index', {
            products: products,
            dicSelected: dicSelected,
            username: req.session.userName,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationsError: req.flash('validationsError')[0],
            pageTitle: 'Home',
        })
    }).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}