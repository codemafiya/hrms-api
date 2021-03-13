var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addBank', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".bank_dtl (emp_id,bank_account_no,ifsc_cd,bank_cd,pf_account_no,pan_no) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.bank_account_no)+","+SqlString.escape(input.ifsc_cd)+","+SqlString.escape(input.bank_cd)+","+SqlString.escape(input.pf_account_no)+","+SqlString.escape(input.pan_no)+")";

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Bank is Added"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllBank', (req, res) => {
    
    let objectToSend = {}

   

    
    let db="hrms";

    let sql_fetchCurr = "Select * from " + db + ".bank_dtl"
    
    mysqlPool.query(sql_fetchCurr, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getcodevalue--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = results
            res.send(objectToSend);
        }
    })
})


module.exports = router;