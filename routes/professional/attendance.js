var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addAttendance', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sqlPosting  = "insert into "+db+".attendance (emp_id,dt,arr_time,dep_time,is_short_leave,emp_reason,mgr_comm,salary_ded) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.dt)+","+SqlString.escape(input.arr_time)+","+SqlString.escape(input.dep_time)+","+SqlString.escape(input.is_short_leave)+","+SqlString.escape(input.emp_reason)+","+SqlString.escape(input.mgr_comm)+","+SqlString.escape(input.salary_ded)+")";

    mysqlPool.query(sqlPosting, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Attendance added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.put('/updateAttendance', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sql = "update "+db+".attendance set emp_id="+SqlString.escape(input.emp_id)+",arr_time="+SqlString.escape(input.arr_time)+",dep_time="+SqlString.escape(input.dep_time)+",dt="+SqlString.escape(input.dt)
    +",emp_reason="+SqlString.escape(input.emp_reason)+",mgr_comm="+SqlString.escape(input.mgr_comm)+",salary_ded="+SqlString.escape(input.salary_ded)+",is_short_leave="+SqlString.escape(input.is_short_leave)+" where id="+SqlString.escape(input.id);
    mysqlPool.query(sql, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Attendance added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllAttendance:dtls', (req, res) => {
    let objectToSend = {}

   
    var input  = JSON.parse(req.params.dtls)

    
    var db = "hrms"+"_"+input.acct_id;

    let sql_fetchCurr = "Select e.emp_id,e.emp_first_name,e.emp_middle_name,e.emp_last_name,a.* from " + db + ".attendance a join "+db+".emp_info e on a.emp_id=e.emp_id where a.dt="+SqlString.escape(input.dt);
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

router.delete('/deleteAttendance:dtls',(req,res)=>{
    let objectToSend = {};
    var input  = JSON.parse(req.params.dtls)

    var id = input.id;
    var db = "hrms"+"_"+input.acct_id;

    var sqlQuery = "delete from "+db+ ".attendance where id="+SqlString.escape(id);
    mysqlPool.query(sqlQuery,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Error Occurred During Delete Of Employee";
            res.send(objectToSend)

        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Attendance Deleted Successfully";
            res.send(objectToSend)
        }
    });

})
module.exports = router;