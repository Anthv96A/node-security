const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());
const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const verifyToken = require('./VerifyToken');

router.post('/register', async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const result = await user.save();
        const token = jwt.sign({_id: result._id}, config.secret, {
            expiresIn: 86400
        })
        return res.status(200).send({
            message: 'Registered successfully!!',
            auth: true,
            token: token
        })

    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong!!' ,
            error: e
        })
    }

})


router.get('/me', verifyToken, (req, res, next) => {

        User.findById(req.userId, {password: 0}, // {password: 0} Stops password been sent back!
            (err, user) => {

            if(err){
                return res.json(500).json({
                    message: 'There was a problem finding the user!',
                    error: err
                })
            }

            if(!user){
                return res.status(404).json({
                          message: 'No user found!'
                });
            }

            next(user);
     })
})

router.use((user, req, res, next) => {
    res.status(200).send(user);
})

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email },  (err, user) => {
        if (err) {
            return res.status(500).json({
                message: 'Error on the server.',
                error: err
            });
        }

        if (!user) {
            return res.status(404).send('No user found.');
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                auth: false, token: null
            });
        }
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.status(200).json({
            auth: true,
            token: token
        });
    });
});


router.get('/logout', (req, res) => {
    return res.status(200).json({
        message: 'Logged out successfully!!',
        auth: false,
        token: null
    })
})


module.exports = router;