var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addFixPay', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".fix_pay (emp_id,pay_cd,pay_type_cd,amount,effective_start_dt,status) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.pay_cd)+","+SqlString.escape(input.pay_type_cd)+","+SqlString.escape(input.amount)+","+SqlString.escape(input.effective_start_dt)+",'A'"+")";

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
router.get('/getfixPay:dtls', (req, res) => {
    
    let objectToSend = {}
    var emp_id = req.params.dtls;
   

    
    let db=propObj.db;

    let sql_fetchCurr = "Select f.*,e.emp_id,e.emp_first_name,e.emp_middle_name,e.emp_last_name from " + db + ".fix_pay f join "+db+".emp_info e on f.emp_id=e.emp_id where f.emp_id="+SqlString.escape(emp_id);
    
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
router.delete('/deleteFixPay:dtls',(req,res) => {
    var id = req.params.dtls;
    var objectToSend = {};
    var db = propObj.db;
    var query = "delete from "+db+".fix_pay where id="+SqlString.escape(id);
    mysqlPool.query(query,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Some Error occurred at Server Side";
            res.send(objectToSend);
        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Fix Pay Deleted";
            res.send(objectToSend);

        }
    })

})

module.exports = router;