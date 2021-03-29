const productsModel = require('../models/products.model')
const ordersModel = require('../models/orders.model')
const moment = require('moment')

exports.getAdd = (req, res, next) => {
    res.render("add-product", {
        validationErrors: req.flash('validationErrors'),
        isUser: true,
        isAdmin: true,
        pageTitle: 'Add-Product',
    })
}

exports.postAdd = (req, res, next) => {
    productsModel.addProduct({
        name: req.body.name,
        image: req.file.filename,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
    }).then(() => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        res.redirect('/error')
    })
}

exports.getOrders = (req, res, next) => {
    let validCategories = ['pending', 'sent', 'completed'];
    let dicSelected_all = {
        'all': '',
        'pending': '',
        'sent': '',
        'completed': '',
    };
    let category = req.query.category;
    let email = req.query.email;
    dicSelected_all[category] = 'selected';
    let ordersPromise;
    if (email && email != '') {
        ordersPromise = ordersModel.getOrdersByEmail(email, category);
    } else if (category && validCategories.includes(category))
        ordersPromise = ordersModel.getOrdersByCategory(category);
    else
        ordersPromise = ordersModel.getItemsAll();

    ordersPromise.then(
        (items) => {
            for (var i = 0; i < items.length; i++) {
                items[i].final_date = moment(items[i].timestamp).format("DD/MM/YYYY h:mm")
                let dicSelected = {
                    'pending': '',
                    'sent': '',
                    'completed': '',
                };
                dicSelected[items[i].status] = 'selected';
                items[i].dicSelected = dicSelected
            }
            res.render('manage-orders', {
                items,
                isUser: true,
                isAdmin: req.session.isAdmin,
                dicSelected_all: dicSelected_all,
                pageTitle: 'Manage-Orders',
            });
        }
    ).catch(err => {
        console.log(err);
        res.redirect('/error')
    });
}

exports.saveOrder = (req, res, next) => {
    ordersModel.editItem(req.body.orderId, { status: req.body.status, timestamp: Date.now() })
        .then(() => {
            res.redirect('/admin/orders');
        }).catch(err => {
            console.log(err);
            res.redirect('/error')
        })
}