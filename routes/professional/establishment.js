var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addEstablishment', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sqlPosting  = "insert into "+db+".establishment (emp_id,emp_designation,department,office) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.emp_designation)+","+SqlString.escape(input.department)+","+SqlString.escape(input.office)+")";

    mysqlPool.query(sqlPosting, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Establishment added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.put('/updateEstablishment', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = "hrms"+"_"+input.acct_id;
    var sql = "update "+db+".establishment set emp_id="+SqlString.escape(input.emp_id)+",emp_designation="+SqlString.escape(input.emp_designation)+",department="+SqlString.escape(input.department)+",office="+SqlString.escape(input.office)
    +" where id="+SqlString.escape(input.id);
    mysqlPool.query(sql, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Establishment added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllEstablishment:dtls', (req, res) => {
    let objectToSend = {}

   
    var input  = JSON.parse(req.params.dtls)

    
    var db = "hrms"+"_"+input.acct_id;

    let sql_fetchCurr = "Select e.emp_id,e.emp_first_name,e.emp_middle_name,e.emp_last_name,a.* from " + db + ".establishment a join "+db+".emp_info e on a.emp_id=e.emp_id";
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

router.delete('/deleteEstablishment:dtls',(req,res)=>{
    let objectToSend = {};
    var input  = JSON.parse(req.params.dtls)

    var id = input.id;
    var db = "hrms"+"_"+input.acct_id;

    var sqlQuery = "delete from "+db+ ".establishment where id="+SqlString.escape(id);
    mysqlPool.query(sqlQuery,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Error Occurred During Delete Of Employee";
            res.send(objectToSend)

        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Establishment Deleted Successfully";
            res.send(objectToSend)
        }
    });

})
module.exports = router;