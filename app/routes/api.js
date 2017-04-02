
var User = require('../models/user')
;
module.exports = function(router) {
    router.post('/users', function (req, res) {
    var user = new User();
    if(!req.body.username || !req.body.email || !req.body.password) {
        res.send("username or email was not provided");
    } else {
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;

        user.save(function (err) {
            if (err) {
                res.send("username or email already exists");
            } else {
                res.send("user created");
            }
        });
    }
});
    return router;
}