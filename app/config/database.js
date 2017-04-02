
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


    mongoose.connect('mongodb://localhost:27017/graph', function (err) {
        if (err) {
            console.log("mongodb disconnected : " + err);
        }
        else {
            console.log("mongodb connected successfully");
        }
    });

