const router = require('express').Router();
const check = require('express-validator').check
const authGuard = require('./guards/auth.guard')
const cartController = require('../controllers/cart.controller');
const bodyParser = require('body-parser');

router.get('/', authGuard.isAuth, cartController.getCart)
router.post('/', authGuard.isAuth, bodyParser.urlencoded({ extended: true }),
    check('amount').not().isEmpty().withMessage('amount is required').isInt({ min: 1 }).withMessage('amount must be greater than 0'), cartController.postCart
)

router.post('/save', authGuard.isAuth, bodyParser.urlencoded({ extended: true }),
    check('amount').not().isEmpty().withMessage('amount is required').isInt({ min: 1 })
    .withMessage('amount must be greater than 0'), cartController.saveCart
)

router.post('/delete', authGuard.isAuth, bodyParser.urlencoded({ extended: true }),
    cartController.delteCart
)

router.post('/verifyorder', authGuard.isAuth, bodyParser.urlencoded({ extended: true }),cartController.verifyorder)
module.exports = router;