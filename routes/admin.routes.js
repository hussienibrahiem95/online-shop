const router = require('express').Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check
const authAdminGuard = require('./guards/admin.guard')
const adminController = require('../controllers/admin.controller')

const multer = require('multer')

router.get('/add', authAdminGuard.isAuthAdmin, adminController.getAdd);

router.get('/orders', authAdminGuard.isAuthAdmin, adminController.getOrders);

router.post('/orders/save', authAdminGuard.isAuthAdmin, bodyParser.urlencoded({ extended: true }), adminController.saveOrder);

router.post('/add', authAdminGuard.isAuthAdmin,
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "images");
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + "-" + file.originalname);
            }
        })
    }).single('image'),
    check('image').custom((values, { req }) => {
        if (req.file) return true;
        throw 'image is required';
    }), adminController.postAdd);


module.exports = router;