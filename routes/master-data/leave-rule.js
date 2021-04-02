var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/createLeaveRule', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sqlJoining  = "insert into "+db+".leave_rule (leave_cd,leave_name,leave_period,no_of_leaves,status) values ("+SqlString.escape(input.leave_cd)+","+SqlString.escape(input.leave_name)+","+SqlString.escape(input.leave_period)+","+SqlString.escape(input.no_of_leaves)+",'A'"+")";

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Leave Rule Added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getLeaveRule:dtls', (req, res) => {
    
    let objectToSend = {}
    var input  = JSON.parse(req.params.dtls)
   

    
    var db = "hrms"+"_"+input.acct_id;

    let sql_fetchCurr = "select * from "+db+".leave_rule";
    
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
router.delete('/deleteLeaveRule:dtls',(req,res) => {
    var input  = JSON.parse(req.params.dtls)
    var id = input.id;
    var objectToSend = {};
    var db = "hrms"+"_"+input.acct_id;
    var query = "delete from "+db+".leave_rule where id="+SqlString.escape(id);
    mysqlPool.query(query,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Some Error occurred at Server Side";
            res.send(objectToSend);
        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Leave Rule Deleted";
            res.send(objectToSend);

        }
    })

})




module.exports = router;