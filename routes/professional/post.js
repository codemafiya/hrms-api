var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/addPost', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlPosting  = "insert into "+db+".posting (emp_id,from_date,to_date,department_cd,project_cd,work,role_cd) values ("+SqlString.escape(input.emp_id)+","+SqlString.escape(input.from_date)+","+SqlString.escape(input.to_date)+","+SqlString.escape(input.department_cd)+","+SqlString.escape(input.project_cd)+","+SqlString.escape(input.work)+","+SqlString.escape(input.role_cd)+")";

    mysqlPool.query(sqlPosting, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Posting is Successfull"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllPosting', (req, res) => {
    let objectToSend = {}

   

    
    var db = propObj.db;

    let sql_fetchCurr = "Select * from " + db + ".emp_info e join "+db+".posting p on p.emp_id=e.emp_id"
    
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

router.delete('/deletePosting:dtls',(req,res)=>{
    let objectToSend = {};
    var id = req.params.dtls;
    var db = propObj.db;

    var sqlQuery = "delete from "+db+ ".posting where id="+SqlString.escape(id);
    mysqlPool.query(sqlQuery,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Error Occurred During Delete Of Employee";
            res.send(objectToSend)

        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Posting Deleted Successfully";
            res.send(objectToSend)
        }
    });

})
module.exports = router;