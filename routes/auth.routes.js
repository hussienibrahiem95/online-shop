const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check
const authController = require('../controllers/auth.controller')
const authGuard = require('./guards/auth.guard')


router.get('/signup', authGuard.notAuth, authController.getSignup);
router.post('/signup', authGuard.notAuth,
    bodyParser.urlencoded({ extended: true }),
    check('username').not().isEmpty().withMessage('username is required'),
    check('email').not().isEmpty().withMessage('email is required').isEmail().not().withMessage('email is not valid'),
    check('password').not().isEmpty().withMessage('password required').isLength({ min: 6 }).withMessage('password should be at least 6 characters'),
    check('ConfirmPassword').custom((value, { req }) => { // it give meta.req  == {req}
        if (value == req.body.password)
            return true;
        else
            throw 'passwords not the same';
    }),
    authController.postSignup);


router.get('/login', authGuard.notAuth, authController.getLogin);
router.post('/login', authGuard.notAuth, bodyParser.urlencoded({ extended: true }),
    check('email').not().isEmpty().withMessage('email is required'),
    check('password').not().isEmpty().withMessage('password required'),
    authController.postLogin);

router.all('/logout', authGuard.isAuth, authController.logout);

module.exports = router;