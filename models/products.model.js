const mongoose = require('mongoose');
const DB_URL = "mongodb+srv://Hussien:PfOSOEwCt4Pd4e58@cluster0.fusrv.mongodb.net/online-shop?retryWrites=true&w=majority";
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    category: String
});
const Product = mongoose.model('product', productSchema);
exports.getAllProducts = () => {
    return new Promise(
        (resolve, reject) => {
            mongoose.connect(DB_URL).then(() => {
                return Product.find({});
            }).then(products => {
                mongoose.disconnect();
                resolve(products);
            }).catch(err => reject(err));
        }
    )
}
exports.getProductsByCategory = (category) => {
    return new Promise(
        (resolve, reject) => {
            mongoose.connect(DB_URL).then(() => {
                return Product.find({ category: category });
            }).then(products => {
                mongoose.disconnect();
                resolve(products);
            }).catch(err => reject(err));
        }
    )
}
exports.getProductById = id => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return Product.findById(id);
        }).then(product => {
            mongoose.disconnect();
            resolve(product);
        }).catch(err => reject(err));
    })
}

exports.addProduct = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            let prod = new Product(data)
            return prod.save();
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });
    })
}