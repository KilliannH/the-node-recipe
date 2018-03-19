const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
    const decoded = jwt.verify(req.body.token, "PrivateJwt");
    req.userData = decoded; //Add new field to my request
    next();
    } catch (error) {
        return res.status(401).json({message: "Auth failed"});
    }
}