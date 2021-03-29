const Orders = require('../models/orders.model')
const validationResult = require('express-validator').validationResult
const moment = require('moment')

exports.getOrders = (req, res, next) => {
    Orders.getItemsByUser(req.session.userId).then(
        (items) => {
            for (var i = 0; i < items.length; i++) {
                items[i].final_date = moment(items[i].timestamp).format("DD/MM/YYYY h:mm")
            }
            res.render('orders', {
                items,
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: 'Orders',
            });
        }
    ).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}

exports.AddOrder = (req, res, next) => {
    Orders.addNewItem(
        req.session.userId, req.body.user_address, req.body.cardId
    ).then(() => {
        res.redirect('/orders');
    }).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}

exports.deleteOrder = (req, res, next) => {
    Orders.deleteItem(req.body.orderId, req.session.userId).then(() => {
        res.redirect('/orders');
    }).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}