exports.isAuthAdmin = (req, res, next) => {
    if (req.session.isAdmin) next()
    else {
        console.log('not admin');
        res.redirect('/');
    }
}