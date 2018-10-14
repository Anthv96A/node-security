const jwt = require('jsonwebtoken');
const config = require('../config');


const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(403).json({
            message: 'No token provided!',
            auth: false
        })
    }

    jwt.verify(token,config.secret, (err, decoded) => {
        if(err){
            return res.status(500).json({
                message: 'Something went wrong!',
                error: err
            })
        }



        req.userId = decoded._id;
        //console.log(req.userId);
        next();
    })

};


module.exports = verifyToken;