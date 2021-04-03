var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addJoining', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
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
router.put('/updateEmployeeInfo', (req, res) => {
    let objectToSend = {}
    let input = req.body;
    //var db = "hrms_1";
    var db = "hrms"+"_"+input.acct_id;
    var sqlJoining  = "update "+db+".emp_info set emp_first_name="+SqlString.escape(input.emp_first_name)+",emp_middle_name="+SqlString.escape(input.emp_middle_name)+",emp_last_name="+SqlString.escape(input.emp_last_name)+",dob="+SqlString.escape(input.dob)+",joining_date="+SqlString.escape(input.joining_date)
    +",marital_status="+SqlString.escape(input.marital_status)+",emp_gender="+SqlString.escape(input.emp_gender)+",emp_company_email="+SqlString.escape(input.emp_company_email)+",emp_father_name="+SqlString.escape(input.emp_father_name)+",emp_husband_name="+SqlString.escape(input.emp_husband_name)
    +",emp_nationality="+SqlString.escape(input.emp_nationality)
    +",emp_per_address_line1="+SqlString.escape(input.emp_per_address_line1)
    +",emp_per_address_line2="+SqlString.escape(input.emp_per_address_line2)
    +",emp_per_district="+SqlString.escape(input.emp_per_district)
    +",emp_per_state="+SqlString.escape(input.emp_per_state)
    +",emp_per_zip_cd="+SqlString.escape(input.emp_per_zip_cd)
    +",emp_personal_email="+SqlString.escape(input.emp_personal_email)
    +",emp_primary_phone_no="+SqlString.escape(input.emp_primary_phone_no)
    +",emp_secondary_phone_no="+SqlString.escape(input.emp_secondary_phone_no)
    +",emp_temp_address_line1="+SqlString.escape(input.emp_temp_address_line1)
    +",emp_temp_address_line2="+SqlString.escape(input.emp_temp_address_line2)
    +",emp_temp_district="+SqlString.escape(input.emp_temp_district)
    +",emp_temp_state="+SqlString.escape(input.emp_temp_state)
    +",emp_temp_zip_cd="+SqlString.escape(input.emp_temp_zip_cd)
    +",offer_letter_no="+SqlString.escape(input.offer_letter_no)
    +" where emp_id="+SqlString.escape(input.emp_id);
    //console.log(sqlJoining)

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Employee Info Updated is Successfull"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllEmployees:dtls', (req, res) => {
    let objectToSend = {}

   
    var input  = JSON.parse(req.params.dtls)

    
    var db = "hrms"+"_"+input.acct_id;

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
    var input  = JSON.parse(req.params.dtls)

    let objectToSend = {};
    var emp_id = input.emp_id;
    var db = "hrms"+"_"+input.acct_id;

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