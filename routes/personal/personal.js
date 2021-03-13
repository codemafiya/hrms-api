var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addJoining', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".emp_info (emp_first_name,emp_last_name,emp_middle_name,emp_personal_email,emp_primary_phone_no,emp_gender) values ("+SqlString.escape(input.emp_first_name)+","+SqlString.escape(input.emp_last_name)+","+SqlString.escape(input.emp_middle_name)+","+SqlString.escape(input.emp_personal_email)+","+SqlString.escape(input.emp_primary_phone_no)+","+SqlString.escape(input.emp_gender)+")";

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = true;
            objectToSend["data"] = "Joining is Successfull"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllEmployees', (req, res) => {
    console.log("Hiii");
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


module.exports = router;