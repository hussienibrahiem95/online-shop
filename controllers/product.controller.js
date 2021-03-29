const productsModel = require('../models/products.model')


exports.getProduct = (req, res, next) => {
    // get id
    // get product 
    // render to page 
    let id = req.params.id;
    productsModel.getProductById(id).then(
        (product) => {
            res.render('product', {
                product: product,
                isUser: true,
                isAdmin: req.session.isAdmin,
                validationsError: req.flash('validationsError')[0],
                pageTitle: 'Products',
            });
        }).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}