var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/createAccount', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".bill (bill_desc,bill_dt,bill_amt,bill_status,bill_type,year,month) values ("+SqlString.escape(input.bill_desc)+","+SqlString.escape(input.bill_dt)+","+SqlString.escape(input.bill_amt)+",'G',"+"'S',"+SqlString.escape(input.year)+","+SqlString.escape(input.month)+")";

    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            var insertId = results.insertId;
           
            var data = req.body.data;
           
            var sqlBillItem = "insert into "+db+".bill_item(bill_id,emp_id,pay_cd,pay_type_cd,amount,days) values"
            for(var i=0;i<data.length;i++){
                sqlBillItem+="("+SqlString.escape(insertId)+","+SqlString.escape(data[i]['emp_id'])+","+SqlString.escape(data[i]['pay_cd'])+","+SqlString.escape(data[i]['pay_type_cd'])+","+SqlString.escape(data[i]['amount'])+","+SqlString.escape(data[i]['days'])+")";
                if(i!=data.length-1){
                    sqlBillItem+=",";
                }
            }
            mysqlPool.query(sqlBillItem,function(error1,results1){
                if (error1) {
                    console.log("Error in Bill Items-", error)
                    objectToSend["error"] = true
                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                    res.send(objectToSend);
                } else {
                    objectToSend["error"] = false;
                    objectToSend["data"] = "Bill Created Successfully"
                    res.send(objectToSend)
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