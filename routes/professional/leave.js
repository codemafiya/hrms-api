var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addLeaveInfo', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sqlPosting  = "insert into "+db+".emp_xref_leave (emp_id,leave_cd,no_of_leaves,used_leaves,status) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.leave_cd)+","+SqlString.escape(input.no_of_leaves)+",0,'A'"+")";

    mysqlPool.query(sqlPosting, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Leave added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.put('/updateLeaveInfo', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sql = "update "+db+".emp_xref_leave set emp_id="+SqlString.escape(input.emp_id)+",leave_cd="+SqlString.escape(input.leave_cd)+",no_of_leaves="+SqlString.escape(input.no_of_leaves)+",used_leaves="+SqlString.escape(input.used_leaves)
    +",status="+SqlString.escape(input.status)+" where id="+SqlString.escape(input.id);
    mysqlPool.query(sql, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Leave Updated Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getLeaveInfo:dtls', (req, res) => {
    let objectToSend = {}

   
    var input  = JSON.parse(req.params.dtls)

    
    var db = "hrms"+"_"+input.acct_id;

    let sql_fetchCurr = "Select e.emp_id,e.emp_first_name,e.emp_middle_name,e.emp_last_name,a.* from " + db + ".emp_xref_leave a join "+db+".emp_info e on a.emp_id=e.emp_id";
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

router.delete('/deleteLeaveInfo:dtls',(req,res)=>{
    let objectToSend = {};
    var input  = JSON.parse(req.params.dtls)

    var id = input.id;
    var db = "hrms"+"_"+input.acct_id;

    var sqlQuery = "delete from "+db+ ".emp_xref_leave where id="+SqlString.escape(id);
    mysqlPool.query(sqlQuery,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Error Occurred During Delete Of Employee";
            res.send(objectToSend)

        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Leave Deleted Successfully";
            res.send(objectToSend)
        }
    });

})
module.exports = router;