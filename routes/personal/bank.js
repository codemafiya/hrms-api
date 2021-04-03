var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addBank', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
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
router.put('/updateBank', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sqlUpdate = "update "+db+".bank_dtl set bank_account_no="+SqlString.escape(input.bank_account_no)+",ifsc_cd="+SqlString.escape(input.ifsc_cd)+",bank_cd="+SqlString.escape(input.bank_cd)+",pf_account_no="+SqlString.escape(input.pf_account_no)+",pan_no="+SqlString.escape(input.pan_no)+" where id="+SqlString.escape(input.id);
    
    mysqlPool.query(sqlUpdate, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Bank is Updated"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllBank:dtls', (req, res) => {
    
    let objectToSend = {}

    var input  = JSON.parse(req.params.dtls)


    
    var db = "hrms"+"_"+input.acct_id;

    let sql_fetchCurr = "Select * from " + db + ".emp_info e join "+db+".bank_dtl b where b.emp_id=e.emp_id"
    //console.log(sql_fetchCurr);
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