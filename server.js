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

var personal = require('./routes/personal/personal.js');
app.use('/personal',personal);
var bank = require('./routes/personal/bank.js');
app.use('/bank',bank);
var post = require('./routes/professional/post.js');
app.use('/post',post);
var fix = require('./routes/pay/fix.js');
app.use('/fix',fix);
var v = require('./routes/pay/variablePay.js');
app.use('/variablePay',v);
var bill = require('./routes/pay/bill.js');
app.use('/bill',bill);
var signup = require('./routes/auth/signup.js');
app.use('/signup',signup);

var signin = require('./routes/auth/signin.js');
app.use('/signin',signin);
var users = require('./routes/auth/users.js');
app.use('/users',users);

var pay = require('./routes/master-data/pay.js');
app.use('/pay',pay);



//Server listen method
var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("HRMS listening at http://%s:%s", host, port)
});



