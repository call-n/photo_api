const debug = require('debug')('books:auth');
const jwt = require('jsonwebtoken');

const validateJwtToken = (req, res, next) => {
    if (!req.headers.authorization) {
        debug("Authorization header missing");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }
 
    const [authSchema, token] = req.headers.authorization.split(' ');
    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }
 
    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
    } catch (error) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }
 
    next();
}
 
module.exports = {
    validateJwtToken,
}