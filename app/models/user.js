var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    validate = require('mongoose-validator')
;

var emailValidator = [
    validate({
        validator: 'isLength',
        arguments: [6, 50],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'matches',
        arguments: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "Not using a proper email form"

    })
],
    passwordValidator = [
        validate({
            validator: 'isLength',
            arguments: [6, 50],
            message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
        })
    ]
;
var UserSchema = new Schema({
    username : { type: String, lowercase: true, required: true, unique: true},
    password : { type: String, required: true, validate: passwordValidator},
    email : { type: String, lowercase: true, required: true, unique: true, validate: emailValidator},

});

UserSchema.pre('save', function (next) {
    var user = this;

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('User', UserSchema);