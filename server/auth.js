module.exports = {
    ensureAuthenticated: (req, res, next) => {
        console.log(req.isAuthenticated())
        if(req.isAuthenticated()) {
            return next();
        } else {
            res.status(403).json({message: 'Not Authenticated'})
        }
    }
}