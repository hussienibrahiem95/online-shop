const router = require('express').Router();
const authGuard = require('./guards/auth.guard')
const bodyParser = require('body-parser');
const ordersController = require('../controllers/orders.controller')

router.get('/', authGuard.isAuth, ordersController.getOrders)


router.post('/', authGuard.isAuth, bodyParser.urlencoded({ extended: true }), ordersController.AddOrder);

router.post('/cancel', authGuard.isAuth, bodyParser.urlencoded({ extended: true }), ordersController.deleteOrder);


module.exports = router;