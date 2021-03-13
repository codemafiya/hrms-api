var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');






//start body-parser configuration
app.use(bodyParser.json({ limit: '50mb' }));
// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




/////////////////
//Portal Requests
var personal = require('./routes/personal/personal.js');
app.use('/personal',personal);
var bank = require('./routes/personal/bank.js');
app.use('/bank',bank);



//Server listen method
var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("HRMS listening at http://%s:%s", host, port)
});



