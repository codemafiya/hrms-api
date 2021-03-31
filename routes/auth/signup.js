var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/createAccount', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sql  = "insert into auth.account (short_name,full_name,ind_type,acct_desc) values ("+SqlString.escape(input.short_name)+","+SqlString.escape(input.full_name)+","+SqlString.escape(input.ind_type)+","+SqlString.escape(input.desc)+")";
    mysqlPool.query(sql, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            var insertId = results.insertId;
           
           
            var sqlUser = "insert into auth.users(email,phone_no,status,password,acct_id) values ("+SqlString.escape(input.email)+","+SqlString.escape(input.phone_no)+",'A'"+","+SqlString.escape(input.password)+","+SqlString.escape(insertId)+")";
            sqlUser+=";"+"insert into auth.account_xref_prod(acct_id,prod_cd) values ("+SqlString.escape(insertId)+","+"'HRMS'"+")";
            sqlUser+=";"+"create database hrms_"+insertId;
            mysqlPool.query(sqlUser,function(error1,results1){
                if (error1) {
                    console.log("Error in Account Create-", error)
                    objectToSend["error"] = true
                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                    res.send(objectToSend);
                } else {
                    var sqlTable = "";
                    var tables = propObj.productTables.hrms;
                    for(var i=0;i<tables.length;i++){
                        sqlTable+="create table hrms_"+insertId+"."+tables[i]+" select * from hrms."+tables[i];
                        if(i!=tables.length-1){
                            sqlTable+=";"
                        }
                    }
                    mysqlPool.query(sqlTable,function(error2,results2){
                        if (error2) {
                            console.log("Error in Account Create2-", error)
                            objectToSend["error"] = true
                            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                            res.send(objectToSend);
                        } else {
                            
        
                            objectToSend["error"] = false;
                            objectToSend["data"] = "Account Created Successfully"
                            res.send(objectToSend)
                        }
                    })

                    
                }
            })
            

        } 
    })
})
router.get('/getAllBill', (req, res) => {
    
    let objectToSend = {}
   
   

    
    let db=propObj.db;

    let sql_fetchCurr = "Select * from " + db + ".bill";
    
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
router.delete('/deleteBill:dtls',(req,res) => {
    var id = req.params.dtls;
    var objectToSend = {};
    var db = propObj.db;
    var query = "delete from "+db+".bill where id="+SqlString.escape(id);
    var query1 = "delete from "+db+".bill_item where bill_id="+SqlString.escape(id);
    
    mysqlPool.query(query+";"+query1,function(error,results){
        if(error){
            objectToSend['error'] = true;
            objectToSend['data'] = "Some Error occurred at Server Side";
            res.send(objectToSend);
        }else{
            objectToSend['error'] = false;
            objectToSend['data'] = "Bill Deleted";
            res.send(objectToSend);

        }
    })

})
router.get('/getAllFixPay', (req, res) => {
    
    let objectToSend = {}
   
   

    
    let db=propObj.db;

    let sql_fetchCurr = "Select * from " + db + ".fix_pay where status='A'";
    
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