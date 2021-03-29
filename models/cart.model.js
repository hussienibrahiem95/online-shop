const mongoose = require('mongoose');
const { reject } = require('bcrypt/promises');
const DB_URL = "mongodb+srv://Hussien:PfOSOEwCt4Pd4e58@cluster0.fusrv.mongodb.net/online-shop?retryWrites=true&w=majority";
const cartSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timestamp: Number
});
const cartItem = mongoose.model('cart', cartSchema);
exports.addNewItem = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            let newItem = new cartItem(data);
            console.log(newItem)
            return newItem.save();
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}

exports.getItemBycartId = (cartId) => {
    console.log('card id ' + cartId)
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return cartItem.findById(cartId);
        }).then((item) => {
            mongoose.disconnect();
            resolve(item);
        }).catch(err => {
            console.log(err);
            mongoose.disconnect();
            reject(err)
        });
    })
}
exports.getItemsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return cartItem.find({ userId: userId }, {}, { sort: { timestamp: 1 } });
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}
exports.getItemByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).
        then(() => {
            return cartItem.find({ productId: productId });
        }).then((item) => {
            mongoose.disconnect();
            resolve(item);
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    });

}
exports.editItem = (cardId, newData) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return cartItem.updateOne({ _id: cardId }, newData);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}
exports.deleteItem = (cardId, userId) => {
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            if (cardId == "delete_all")
                return cartItem.deleteMany({ userId: userId });
            else
                return cartItem.findByIdAndDelete(cardId);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}