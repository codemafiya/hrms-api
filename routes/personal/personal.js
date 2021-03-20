var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addJoining', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".emp_info (emp_first_name,emp_last_name,emp_middle_name,emp_personal_email,emp_primary_phone_no,emp_gender,dob,joining_date,offer_letter_no,emp_father_name,status) values ("+SqlString.escape(input.emp_first_name)+","+SqlString.escape(input.emp_last_name)+","+SqlString.escape(input.emp_middle_name)+","+SqlString.escape(input.emp_personal_email)+","+SqlString.escape(input.emp_primary_phone_no)+","+SqlString.escape(input.emp_gender)+","+SqlString.escape(input.dob)+","+SqlString.escape(input.joining_date)+","+SqlString.escape(input.offer_letter_no)+","+SqlString.escape(input.emp_father_name)+","+SqlString.escape(input.status)+")";

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Joining is Successfull"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllEmployees', (req, res) => {
    let objectToSend = {}

   

    
    let db="hrms";

    let sql_fetchCurr = "Select * from " + db + ".emp_info"
    
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

router.delete('/deleteEmployee:dtls',(req,res)=>{
    let objectToSend = {};
    var emp_id = req.params.dtls;
    var db = propObj.db;

    var sqlQuery = "delete from "+db+ ".emp_info where emp_id="+SqlString.escape(emp_id);
    mysqlPool.query(sqlQuery,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Error Occurred During Delete Of Employee";
            res.send(objectToSend)

        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Employee Deleted Successfully";
            res.send(objectToSend)
        }
    });

})
module.exports = router;