const mongoose = require('mongoose');
const DB_URL = "mongodb+srv://Hussien:PfOSOEwCt4Pd4e58@cluster0.fusrv.mongodb.net/online-shop?retryWrites=true&w=majority";
const cartModel = require('../models/cart.model')
const userModel = require('../models/auth.model')

const OrderSchema = mongoose.Schema({
    prod_name: String,
    price: Number,
    amount: Number,
    userId: String,
    cartId: String,
    address: String,
    status: String,
    userEmail: String,
    timestamp: Number,
});
const orderItem = mongoose.model('order', OrderSchema);
exports.addNewItem = (userId, address, cartId) => {
    return new Promise((resolve, reject) => {
        cartModel.getItemBycartId(cartId).then(
            (item) => {
                var userDetails;
                var email_user;
                let newItem
                userModel.getUserById(userId).then(user => {
                    newItem = new orderItem({
                        prod_name: item.name,
                        price: item.price,
                        amount: item.amount,
                        cartId: cartId,
                        userId: userId,
                        status: 'pending',
                        timestamp: Date.now(),
                        address: address,
                        userEmail: user.email,
                    });
                }).then(() => {
                    mongoose.connect(DB_URL).then(() => {
                        return newItem.save();
                    }).then(() => {
                        mongoose.disconnect();
                        cartModel.deleteItem(cartId);
                        resolve();
                    }).catch(err => {
                        mongoose.disconnect();
                        reject(err)
                    });
                }).catch(err => {
                    mongoose.disconnect();
                    reject(err)
                });

            });

    })
}
exports.getItemsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return orderItem.find({ userId: userId }, {}, { sort: { timestamp: 1 } });
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}
exports.deleteItem = (orderId, userId) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            if (orderId == "delete_all")
                return orderItem.deleteMany({ userId: userId });
            else
                return orderItem.findByIdAndDelete(orderId);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}

exports.getItemsAll = () => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return orderItem.find({}, {}, { sort: { timestamp: 1 } });
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}
exports.getOrdersByCategory = (category) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return orderItem.find({ status: category }, {}, { sort: { timestamp: 1 } });
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}

exports.getOrdersByEmail = (email, category) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            if (category != 'All')
                return orderItem.find({ userEmail: email, status: category }, {}, { sort: { timestamp: 1 } });
            return orderItem.find({ userEmail: email }, {}, { sort: { timestamp: 1 } });
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}

exports.editItem = (OrderId, newData) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return orderItem.updateOne({ _id: OrderId }, newData);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}