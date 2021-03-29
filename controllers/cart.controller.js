const cartModel = require('../models/cart.model')
const validationResult = require('express-validator').validationResult

exports.getCart = (req, res, next) => {
    cartModel.getItemsByUser(req.session.userId).then(
        (items) => {
            res.render('cart', {
                items: items,
                isUser: true,
                isAdmin: req.session.isAdmin,
                validationsError: req.flash('validationsError')[0],
                pageTitle: 'Cart',
            });
        }
    ).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}
exports.postCart = (req, res, next) => {
    if (validationResult(req).isEmpty()) {

        cartModel.getItemByProductId(req.body.productId).then((item) => {
            if (item.length && item[0]._id && item[0].userId == req.session.userId) {
                cartModel.editItem(item[0]._id, { amount: (+item[0].amount + +req.body.amount), timestamp: Date.now() })
                    .then(() => {
                        res.redirect('/cart');
                    }).catch(err => {
                        console.log(err);
                    })
            } else {
                cartModel.addNewItem({
                    name: req.body.name,
                    price: req.body.price,
                    amount: req.body.amount,
                    productId: req.body.productId,
                    userId: req.session.userId,
                    timestamp: Date.now()
                }).then(() => {
                    res.redirect('/cart');
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/error')
        })
    } else {
        req.flash('validationsError', validationResult(req).array());
        res.redirect(req.body.redirectTo);
    }
}

exports.saveCart = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel.editItem(req.body.cardId, { amount: req.body.amount, timestamp: Date.now() })
            .then(() => {
                res.redirect('/cart');
            }).catch(err => {
                console.log(err);
                res.redirect('/error')
            })
    } else {
        console.log(validationResult(req).array());
        req.flash('validationsError', validationResult(req).array());
        res.redirect('/cart');
    }
}

exports.delteCart = (req, res, next) => {
    cartModel.deleteItem(req.body.cardId, req.session.userId)
        .then(() => {
            res.redirect('/cart');
        }).catch(err => {
            console.log(err);
            res.redirect('/error')
        })
}

exports.verifyorder = (req, res, next) => {
    console.log('card id  : ' + req.body.cardId);
    res.render('verifyorders', {
        cardId: req.body.cardId,
        isUser: true,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Verify Orders',
    })
}