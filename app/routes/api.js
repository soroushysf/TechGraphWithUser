
var User = require('../models/user'),
    jwt = require('jsonwebtoken')
;
var config = require('../config/credentials')
;

module.exports = function(router) {
    router.post('/users', function (req, res) {
    var user = new User();
    if(!req.body.username || !req.body.email || !req.body.password) {
        res.json({ success: false, message: "username or email was not provided"});
    } else {
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;

        user.save(function (err) {
            if (err) {
                res.json({success: false, message :"username or email already exists"});
            } else {
                res.json({ success: true, message: "user created"});
            }
        });
    }
});

    router.post('/authenticate', function (req, res) {
        User.findOne({ email: req.body.email}).select('email username password').exec(function(err, user) {
            if(err) throw err;

            if(!user) {
                res.json({ success: false, message: "could not authenticate user"});
            } else if(user) {
                if(req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: "no password provided"});
                }
               if(!validPassword) {
                   res.json({ success: false, message: "could not validate password"});
               } else {
                   var token = jwt.sign({ email: user.email, username: user.username }, config.secret, { expiresIn: '24h'});
                   res.json({ success: true, message: "User authenticated successfully", token: token});
               }
            }
        })
    });

    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if(err) {
                    res.json({ success: false, message: "token invalid"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.json({ success: false, message: "no token provided"});
        }

    });
    router.post('/me', function (req, res) {
       res.send(req.decoded);
    });
    return router;
};