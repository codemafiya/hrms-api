var express = require('express');
var router = express.Router();
var SqlString = require('sqlstring');
var propObj = require('../../config_con')
let mysqlPool = require('../../connections/mysqlConnection');


router.get('/getcodevalue:dtls', (req, res) => {

    let objectToSend = {}

    let b_acct_id = req.params.dtls;

    
    let db="svayam_"+b_acct_id+"_md";

    let sql_fetchCurr = "Select * from " + db + ".svayam_code_value"
    
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

router.post('/createcodevalue', (req, res) => {
    let obj = req.body;
    
    let objectToSend = {}
    let db="svayam_"+obj.b_acct_id+"_md";

    let sql_insert = "insert into " + db + ".svayam_code_value (field_code,code,value) values"
        + " (" + SqlString.escape(obj.field_code) + "," + SqlString.escape(obj.code) + "," + SqlString.escape(obj.value) +") "

    mysqlPool.query(sql_insert, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->createField-->", error)
            objectToSend["error"] = true;
            if (error.detail != undefined || error.detail != null) {
                if (error.detail.includes("already exists")) {
                    objectToSend["data"] = "Possible duplicates"
                } else {
                    objectToSend["data"] = "Some error occured at server Side. Please try again later"
                }
            } else {
                objectToSend["data"] = "Some error occured at server Side. Please try again later"
            }

            res.send(objectToSend)
        } else {

            objectToSend["error"] = false;
            objectToSend["data"] = results.insertId
            res.send(objectToSend)
        }
    })

})

router.put('/updatecodevalue', (req, res) => {
    let obj = req.body
    let db="svayam_"+obj.b_acct_id+"_md";

    let objectToSend = {}
    
    let sql= "update " + db + ".svayam_code_value set code=" + SqlString.escape(obj.code) + ",value=" + SqlString.escape(obj.value) +  " where id=" + SqlString.escape(obj.id)+";"

     

    
     mysqlPool.getConnection(function (error, mysqlCon) {
        if (error) {
            console.log("Error-->routes-->signup-->signUp--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            mysqlCon.beginTransaction(function (error1) {
                if (error1) {
                    console.log("Error-->routes-->signup-->signUp--", error1)
                    objectToSend["error"] = true
                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                    res.send(objectToSend);
                    mysqlCon.release();
                } else {
                       mysqlCon.query(sql, function (error, results) {
                        if (error) {
                            console.log("Error-->routes-->projectMetadata-->businessResourceData-->updateField-->", error)
                            objectToSend["error"] = true;
                            objectToSend["data"] = "Some error occured at server Side. Please try again later"
                            res.send(objectToSend)
                            mysqlCon.rollback();
                        mysqlCon.release()
                        } else {
                            
                                mysqlCon.query('COMMIT', function (error2) {
                                    if (error2) {
                                        console.log("Error-->routes-->projectMetadata-->businessResourceData-->updateField-->", error2)
                                        objectToSend["error"] = true;
                                        objectToSend["data"] = "Some error occured at server Side. Please try again later"
                                        res.send(objectToSend)
                                        mysqlCon.rollback();
                        mysqlCon.release()
                                    } else {
                                        objectToSend["error"] = false;
                                        objectToSend["data"] = "Field Update Successfully"
                                        res.send(objectToSend)
                                    }
                                    
                                })
                            
                        }
                    })
                }
            })
        }


        })



    

   
    })

router.delete('/deletecodevalue:dtls', (req, res) => {
        let obj = JSON.parse(req.params.dtls)
        let objectToSend = {}
        let id = obj.id
        
        let db="svayam_"+obj.b_acct_id+"_md";
       
                let sql_deleteFld = "delete from " + db + ".svayam_code_value where id='" + id + "'"
                mysqlPool.query(sql_deleteFld, function (error1, results1) {
                    if (error1) {
                        console.log("Error-->routes-->projectMetadata-->businessResourceData-->deleteField-->", error)
                        objectToSend["error"] = true;
                        objectToSend["data"] = "Some error occured at server Side. Please try again later"
                        res.send(objectToSend)
                    } else {
                        objectToSend["error"] = false;
                        objectToSend["data"] = "Field deleted successfully"
                        res.send(objectToSend)
                    }
                })
            })

module.exports = router