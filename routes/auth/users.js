var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.put('/updateUserInfo', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
   var sql = "update auth.users set first_name="+SqlString.escape(input.first_name)+",last_name="+SqlString.escape(input.last_name)+",email="+SqlString.escape(input.email)+",phone_no="+SqlString.escape(input.phone_no)+" where id="+SqlString.escape(input.id);
    console.log(sql);
    mysqlPool.query(sql, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "User Details is Updated"
            res.send(objectToSend)

        } 
    })
})
router.put('/changePassword', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
   var sql = "update auth.users set password="+SqlString.escape(input.password)+" where id="+SqlString.escape(input.id);
    console.log(sql);
    mysqlPool.query(sql, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Password is Updated"
            res.send(objectToSend)

        } 
    })
})



module.exports = router;