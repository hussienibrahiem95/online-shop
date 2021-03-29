const mongoose = require('mongoose');
const DB_URL = "mongodb+srv://Hussien:PfOSOEwCt4Pd4e58@cluster0.fusrv.mongodb.net/online-shop?retryWrites=true&w=majority";
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});
const User = mongoose.model('user', userSchema);

exports.createNewUser = (username, email, password) => {
    // check if email exists  if yes return error
    // else create new account
    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return User.findOne({ email: email });
        }).then(user => {
            if (user) {
                mongoose.disconnect();
                reject('email is used');
            } else {
                return bcrypt.hash(password, 10); // it return promise 
            }
        }).then(hashed_pass => {
            let newUser = new User({
                username: username,
                email: email,
                password: hashed_pass
            });
            return newUser.save(); // it return promise
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err)
        });

    })
}

exports.getUser = (email, password) => {
    // check if email is found
    // store user bool in cookies set session

    return new Promise((resolve, reject) => {
        mongoose.
        connect(DB_URL).
        then(() => {
            return User.findOne({ email: email });
        }).then(
            user => {
                if (!user) {
                    mongoose.disconnect();
                    reject('email is not found');
                } else {
                    return bcrypt.compare(password, user.password).then(same => {
                        if (!same) {
                            mongoose.disconnect();
                            reject('password is incorrect');
                        } else {
                            mongoose.disconnect();
                            resolve([user._id, user.username, user.isAdmin])
                        }
                    });
                }
            }).catch(
            err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.getUserById = (UserId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return User.findById(UserId);
        }).then(user => {
            mongoose.disconnect();
            resolve(user);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    });
}