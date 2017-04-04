var express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    path = require('path')
;

var appRoutes = require('./app/routes/api')(router);
require('./app/config/database');
var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);     //http://localhost:3000/api/


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});



app.listen(port, function () {
    console.log("server is running on port : "+ port);
});