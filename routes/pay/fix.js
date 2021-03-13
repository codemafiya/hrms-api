var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addFixPay', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".fix_pay (emp_id,pay_cd,pay_type_cd,amount,effective_dt,status) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.pay_cd)+","+SqlString.escape(input.pay_type_cd)+","+SqlString.escape(input.amount)+","+SqlString.escape(input.effective_dt)+","+SqlString.escape(input.status)+")";

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Fix Pay Added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getfixPay', (req, res) => {
    
    let objectToSend = {}

   

    
    let db="hrms";

    let sql_fetchCurr = "Select * from " + db + ".fix_pay f join "+db+".emp_info e on f.emp_id=e.emp_id"
    
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