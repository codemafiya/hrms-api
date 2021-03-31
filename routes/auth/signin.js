var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/login', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var loginQuery  = "select * from auth.users where email="+SqlString.escape(input.email)+" and password="+SqlString.escape(input.password);
    console.log(loginQuery);
    mysqlPool.query(loginQuery, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else if(results.length == 0) {
            objectToSend["error"] = true;
            objectToSend["data"] = "User Details Not Found"
            res.send(objectToSend)
           
            

        } else{
            objectToSend["error"] = false;
            objectToSend["data"] = results;
            res.send(objectToSend)
        }
    })
})


module.exports = router;