const express = require('express');
const path = require('path');
const Session = require('express-session')
const SessionStore = require('connect-mongodb-session')(Session);

const flash = require('connect-flash')

const homeRouter = require('./routes/home.routes')
const productRouter = require('./routes/product.routes')
const authUser = require('./routes/auth.routes');
const cartRouter = require('./routes/cart.routes');
const ordersRouter = require('./routes/orders.routes');
const AdminRouter = require('./routes/admin.routes');


const app = express()


app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'images')))

const DB_URL = "mongodb+srv://Hussien:PfOSOEwCt4Pd4e58@cluster0.fusrv.mongodb.net/online-shop?retryWrites=true&w=majority";

// to create session and add session property to every request
const STORE = new SessionStore({
    uri: DB_URL,
    collection: 'sessions'
})
app.use(Session({
    secret: 'this is my secret secret to hash',
    saveUninitialized: false,
    // cookie: { // if need to remove cookie after time  or
    // let its default that remove when browser close
    //     maxAge : 1*0
    // }
    store: STORE
}));

// use flash to store variables
app.use(flash())


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', homeRouter);
app.use('/product/', productRouter);
app.use('/', authUser);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/admin', AdminRouter);
app.get('error', (req, res, next) => {
    // this is error happen
    res.status(500);
    res.render('error.ejs', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Not Allowed',
    })
})
app.use((req, res, next) => {
    res.status(404); // not found;
    res.render('not-found.ejs', {
        isUser: req.session.userId,
        isAdmin: req.session.isAdmin,
        pageTitle: 'Not Found',
    })
})
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log('server is listen on port ' + port); });