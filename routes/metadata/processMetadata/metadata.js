var express = require('express');
var router = express.Router();
var SqlString = require('sqlstring');
var propObj = require('../../../config_con')
let mysqlPool = require('../../../connections/mysqlConnection');

router.get('/getSerialColumns:dtls',(req,res)=>{
    let objectToSend={}

    let b_acct_id=req.params.dtls

    let db="svayam_"+b_acct_id+"_md"

    let sql="Select ri.record_technical_name,fi.field_technical_name from (Select record_code,record_technical_name from "+db+".record_info where"
                +" record_type='reference' and"
                +" reference_data_type!='code_value') ri join "
                +" (Select * from "+db+".record_xref_field) rx on ri.record_code=rx.record_code join "
                +" (Select field_code,field_technical_name,datatype_code from "+db+".field_info) fi on rx.field_code=fi.field_code join" 
                +" (Select * from "+db+".datatype_info where datatype_name='serial') di on fi.datatype_code=di.datatype_code"

    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->projectMetadata-->metadata-->getSerialColumns--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = results
            res.send(objectToSend);
        }
    })
})


router.get('/getcodevalue:dtls', (req, res) => {

    let objectToSend = {}

    let obj = JSON.parse(req.params.dtls);

    
    let db = "svayam_" + obj.b_acct_id + "_md";

    let sql_fetchCurr = "Select * from " + db + ". svayam_code_value where field_code in (select field_code from "+ db +".record_xref_field where record_code = " + SqlString.escape(obj.record_code)+")"

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

router.get('/getrecord:dtls', (req, res) => {

    let objectToSend = {}

    let obj = JSON.parse(req.params.dtls);

    
    let db = "svayam_" + obj.b_acct_id + "_md";

    let sql_fetchCurr = "Select * from " + db + ". record_info where record_type = " + SqlString.escape(obj.record_type)+""

    mysqlPool.query(sql_fetchCurr, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getdata--", error)
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

router.get('/getAllFields:dtls',(req,res)=>{

    let objectToSend={}
    let b_acct_id=req.params.dtls

    let sql="Select fi.*,di.datatype_name from svayam_"+b_acct_id+"_md.field_info fi join svayam_"+b_acct_id+"_md.datatype_info di on fi.datatype_code=di.datatype_code"

    mysqlPool.query(sql,(error,results)=>{

        if(error){
            console.log("Error-->routes-->projectMetadata-->metadata-->getAllFields-->", error)
            objectToSend["error"] = true;
            objectToSend["data"] = "Some error occured at server Side. Please try again later"
            res.send(objectToSend)
        }else{
            objectToSend["error"] = false;
            objectToSend["data"] = results
            res.send(objectToSend)
        }
    })



})

router.get('/getSystemDatatypes', (req, res) => {
    let sql_fetchDt = "Select * from " + propObj.svayamSystemDbName + ".available_datatype";
    let objectToSend = {}
    mysqlPool.query(sql_fetchDt, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getDatatypes-->", error)
            objectToSend["error"] = true;
            objectToSend["data"] = "Some error occured at server Side. Please try again later"
            res.send(objectToSend)
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = results
            res.send(objectToSend)
        }
    })
})

router.get('/getLogicalFields',(req,res)=>{
    let objectToSend={}

    let sql_fetch="Select id,logical_field_name from "+propObj.svayamSystemDbName+".logical_field_description "

    mysqlPool.query(sql_fetch,function(error,results){
        if(error){
            console.log("Error-->routes-->projectMetadata-->businessResourceData-->createRecord-->", error)
            objectToSend["error"] = true;
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false;
            objectToSend["data"] = results
            res.send(objectToSend);
        }
    })
})

router.get('/getdata:dtls', (req, res) => {

    let objectToSend = {}

    let obj = JSON.parse(req.params.dtls);

    let table_name = obj.table_name;
    let db = "svayam_" + obj.b_acct_id + "_md";

    let sql_fetchCurr = "Select * from " + db + "." + table_name

    mysqlPool.query(sql_fetchCurr, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getdata--", error)
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

router.post('/createField', (req, res) => {
    let obj = req.body;

    let objectToSend = {}
    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql_insert = "insert into " + db + ".field_info (field_code,field_business_name,field_technical_name,field_logical_id,datatype_code,is_code_value_present,is_code_values_present,is_hierarchy_present) values"
        + " (" + SqlString.escape(obj.field_code) + "," + SqlString.escape(obj.field_business_name) + "," + SqlString.escape(obj.field_technical_name) + "," + SqlString.escape(obj.field_logical_id) + ","
        + "" + SqlString.escape(obj.datatype_code) + "," + SqlString.escape(obj.is_code_value_present) + "," + SqlString.escape(obj.is_code_values_present) + "," + SqlString.escape(obj.is_hierarchy_present) + ") "

    mysqlPool.query(sql_insert, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->createField-->", error)
            objectToSend["error"] = true;
            if (error.message != undefined || error.message != null) {
                if (error.message.includes("Duplicate")) {
                    objectToSend["data"] = "Possible duplicates of field code or field technical name"
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

router.delete('/deleteField:dtls', (req, res) => {
    let obj = JSON.parse(req.params.dtls)
    let objectToSend = {}
    let field_code = obj.field_code

    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql_checkPresence = "Select * from " + db + ".record_xref_field where field_code='" + field_code + "' limit 1"

    mysqlPool.query(sql_checkPresence, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->deleteField-->", error)
            objectToSend["error"] = true;
            objectToSend["data"] = "Some error occured at server Side. Please try again later"
            res.send(objectToSend)
        } else if (results.length != 0) {
            objectToSend["error"] = true;
            objectToSend["data"] = "Unable to delete field as it is used by some records"
            res.send(objectToSend)
        } else {
            let sql_deleteFld = "delete from " + db + ".field_info where field_code='" + field_code + "'"
            mysqlPool.query(sql_deleteFld, function (error1, results1) {
                if (error1) {
                    console.log("Error-->routes-->projectMetadata-->businessResourceData-->deleteField-->", error1)
                    objectToSend["error"] = true;
                    objectToSend["data"] = "Some error occured at server Side. Please try again later"
                    res.send(objectToSend)
                } else {
                    objectToSend["error"] = false;
                    objectToSend["data"] = "Field deleted successfully"
                    res.send(objectToSend)
                }
            })
        }
    })
})

router.put('/updateField', (req, res) => {
    let obj = req.body
    let objectToSend = {}

    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql = "update " + db + ".field_info set field_code=" + SqlString.escape(obj.field_code) + ",field_business_name=" + SqlString.escape(obj.field_business_name) + ",field_technical_name=" + SqlString.escape(obj.field_technical_name) + ",is_code_value_present=" + SqlString.escape(obj.is_code_value_present) + ",is_code_value_present=" + SqlString.escape(obj.is_code_values_present) + ",is_hierarchy_present=" + SqlString.escape(obj.is_hierarchy_present) + ",datatype_code=" + SqlString.escape(obj.datatype_code) + " where field_code=" + SqlString.escape(obj.old_field_code) + ";"




    mysqlPool.getConnection(function (error, mysqlCon) {
        if (error) {
            console.log("Error-->routes-->metadata-->updatefield--", error)
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
                            console.log("Error-->routes-->projectMetadata-->metadata-->updateField-->", error)
                            objectToSend["error"] = true;
                            objectToSend["data"] = "Some error occured at server Side. Please try again later"
                            res.send(objectToSend)
                            mysqlCon.rollback();
                            mysqlCon.release()
                        } else {

                            mysqlCon.query('COMMIT', function (error2) {
                                if (error2) {
                                    console.log("Error-->routes-->projectMetadata-->metadata-->updateField-->", error2)
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

router.post('/createDatatype', (req, res) => {

    let objectToSend = {}

    let obj = req.body;
    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql_fetchCurr = "insert into " + db + ".datatype_info (datatype_code, bus_datatype_name, datatype_name, datatype_length) values("
        + SqlString.escape(obj.datatype_code) + "," + SqlString.escape(obj.bus_datatype_name) + "," + SqlString.escape(obj.datatype_name) + "," + SqlString.escape(obj.datatype_length) + "); "

    mysqlPool.query(sql_fetchCurr, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->createDatatype--", error)
            objectToSend["error"] = true
            if (error.message != undefined || error.message != null) {
                if (error.message.includes("Duplicate")) {
                    objectToSend["data"] = "Possible duplicates of datatype code"
                } else {
                    objectToSend["data"] = "Some error occured at server Side. Please try again later"
                }
            } else {
                objectToSend["data"] = "Some error occured at server Side. Please try again later"
            }
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = results.insertId

            res.send(objectToSend);
        }
    })
})

router.delete('/deleteDatatype:dtls', (req, res) => {
    let obj = JSON.parse(req.params.dtls)
    let objectToSend = {}
    let datatype_code = obj.datatype_code

    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql_checkPresence = "Select * from " + db + ".field_info where datatype_code='" + datatype_code + "' limit 1"

    mysqlPool.query(sql_checkPresence, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->deleteDatatype-->", error)
            objectToSend["error"] = true;
            objectToSend["data"] = "Some error occured at server Side. Please try again later"
            res.send(objectToSend)
        } else if (results.length != 0) {
            objectToSend["error"] = true;
            objectToSend["data"] = "Unable to delete datatype as it is used by some records"
            res.send(objectToSend)
        } else {
            let sql_deleteFld = "delete from " + db + ".datatype_info where datatype_code='" + datatype_code + "'"
            mysqlPool.query(sql_deleteFld, function (error1, results1) {
                if (error1) {
                    console.log("Error-->routes-->projectMetadata-->metadata-->deleteDatatype-->", error)
                    objectToSend["error"] = true;
                    objectToSend["data"] = "Some error occured at server Side. Please try again later"
                    res.send(objectToSend)
                } else {
                    objectToSend["error"] = false;
                    objectToSend["data"] = "Datatype deleted successfully"
                    res.send(objectToSend)
                }
            })
        }
    })
})

router.put('/updateDatatype', (req, res) => {

    let objectToSend = {}

    let obj = req.body;


    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql = "update " + db + ".datatype_info set datatype_code=" + SqlString.escape(obj.datatype_code) + ", bus_datatype_name=" + SqlString.escape(obj.bus_datatype_name) + ", datatype_name=" + SqlString.escape(obj.datatype_name) + ",datatype_length=" + SqlString.escape(obj.datatype_length) + " where datatype_code=" + SqlString.escape(obj.old_datatype_code) + "; "


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
                            console.log("Error-->routes-->projectMetadata-->businessResourceData-->updateDatatype-->", error)
                            objectToSend["error"] = true;
                            objectToSend["data"] = "Some error occured at server Side. Please try again later"
                            res.send(objectToSend)
                            mysqlCon.rollback();
                            mysqlCon.release()
                        } else {
                            mysqlCon.commit(function (error4) {
                                if (error4) {
                                    console.log("Error-->routes-->signup-->signUp--", error4)
                                    objectToSend["error"] = true
                                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."

                                    res.send(objectToSend);
                                    mysqlCon.rollback();
                                    mysqlCon.release()
                                } else {
                                    objectToSend["error"] = false;
                                    objectToSend["data"] = "Datatype Update successfully"
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

router.post('/createRecord', (req, res) => {
    let obj = req.body;

    let objectToSend = {}
    let db = "svayam_" + obj.b_acct_id + "_md";
    let sql_insert = "insert into " + db + ".record_info (record_code,record_business_name,record_technical_name,domain_code,record_type,referred_field_code,reference_data_type,status) values"
        + " (" + SqlString.escape(obj.record_code) + "," + SqlString.escape(obj.record_business_name) + "," + SqlString.escape(obj.record_technical_name) + "," + SqlString.escape(obj.domain_code) + "," + SqlString.escape(obj.record_type) + "," + SqlString.escape(obj.referred_field_code) + "," + SqlString.escape(obj.reference_data_type) + ",'1')"

    let record_code=obj.record_code
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
                }
                mysqlPool.query(sql_insert, function (error, results) {
                    if (error) {
                        console.log("Error-->routes-->projectMetadata-->businessResourceData-->createRecord-->", error)
                        objectToSend["error"] = true;
                        if (error.message != undefined || error.message != null) {
                            if (error.message.includes("Duplicate")) {
                                objectToSend["data"] = "Possible duplicates of record code or technical name"
                            } else {
                                objectToSend["data"] = "Some error occured at server Side. Please try again later"
                            }
                        } else {
                            objectToSend["data"] = "Some error occured at server Side. Please try again later"
                        }

                        res.send(objectToSend)
                        mysqlCon.rollback();
                        mysqlCon.release()
                    } else {

                        let sql_insert = "insert into " + db + ".record_xref_field (record_code,field_code,col_seq_no) values"

                        for (let i = 0; i < obj.data.length; i++) {
                            sql_insert += " (" + SqlString.escape(obj.record_code) + "," + SqlString.escape(obj.data[i].field_code) + "," + i + ") "
                            if (i != obj.data.length - 1) {
                                sql_insert += " ,"
                            }
                        }
                        mysqlCon.query(sql_insert, function (error, results) {
                            if (error) {
                                console.log("Error-->routes-->projectMetadata-->businessResourceData-->createRecord-->", error)
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
                                mysqlCon.rollback();
                                mysqlCon.release()
                            } else {
                                let sql_getFlds = "Select ri.record_code,ri.field_code,ri.col_seq_no,res.field_technical_name"
                                    + " ,res.datatype_code,dt.datatype_name,dt.datatype_length"
                                    + " from (Select * from " + db + ".record_xref_field where record_code=" + SqlString.escape(obj.record_code) + ") ri "
                                    + " join (Select * from " + db + ".field_info) res on ri.field_code=res.field_code"
                                    + " join (Select datatype_code,datatype_name,datatype_length  from " + db + ".datatype_info ) dt"
                                    + " on res.datatype_code=dt.datatype_code"
                                    + " order by col_seq_no"

                                mysqlCon.query(sql_getFlds, function (error2, results2) {
                                    if (error2) {
                                        console.log("Error-->routes-->projectMetadata-->technicalResourceMetadata-->createPhysicalRecord-->", error2)
                                        objectToSend["error"] = true;
                                        objectToSend["data"] = "Some error occured at server Side. Please try again later"
                                        res.send(objectToSend)
                                        mysqlCon.rollback();
                                        mysqlCon.release()
                                    } else {
                                        let fdata = results2

                                        let sql_dropDb = "drop table if exists " + obj.database_name + "." + obj.record_technical_name + ";";


                                        let sql_create = "create table " + obj.database_name + "." + obj.record_technical_name + " ("

                                        let keyName=null
                                        for (let i = 0; i < fdata.length; i++) {
                                            let fld_name = fdata[i]["field_technical_name"]
                                            let fld_type = fdata[i]["datatype_name"]
                                            
                                            if(fld_type=="serial"){
                                                keyName=fld_name
                                                sql_create += fld_name + " bigint NOT NULL AUTO_INCREMENT"
                                            }else{
                                                if (fdata[i]["datatype_length"] != 0) {
                                                    fld_type += "(" + fdata[i]["datatype_length"] + ")"
                                                }
    
                                                sql_create += fld_name + " " + fld_type + " "
                                            }

                                            
                                            if (i < fdata.length - 1) {
                                                sql_create += ","
                                            }
                                            else {

                                                sql_create += ",INDEX ("+keyName+"))"
                                            }
                                        }
                                        mysqlCon.query(sql_dropDb + sql_create, function (error3, results3) {
                                            if (error3) {
                                                let querydel = "delete from " + db + ".record_xref_field where record_code='" + record_code + "';"
                                                        querydel += "delete from " + db + ".record_info where record_code='" + record_code + "';"
                                                        mysqlPool.query(querydel, function (error1, results1) {
                                                            if (error1) {
                                                                console.log("Error-->routes-->projectMetadata-->businessResourceData-->deleteRecord-->", error)
                                                               
                                                            }})
                                                console.log("Error-->routes-->projectMetadata-->technicalResourceMetadata-->createPhysicalRecord-->", error3)
                                                objectToSend["error"] = true;
                                                objectToSend["data"] = "Some error occured at server Side. Please try again later"
                                                res.send(objectToSend)
                                                
                                                mysqlCon.release()
                                            } else {

                                                mysqlCon.commit(function (error4) {
                                                    if (error4) {
                                                        console.log("Error-->routes-->signup-->signUp--", error4)
                                                        objectToSend["error"] = true
                                                        objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                                                        res.send(objectToSend);
                                                        mysqlCon.rollback();
                                                        mysqlCon.release()
                                                    } else {
                                                        objectToSend["error"] = false;
                                                        objectToSend["data"] = results.insertId
                                                        res.send(objectToSend)
                                                        mysqlCon.release()
                                                    }
                                                })
                                            }
                                        })
                                                                           
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    })
})

router.delete('/deleteRecord:dtls', (req, res) => {
    let obj = JSON.parse(req.params.dtls)
    let objectToSend = {}
    let record_code = obj.record_code

    //let schema_name = obj.database
    let db = "svayam_" + obj.b_acct_id + "_md";
    let query = "delete from " + db + ".record_xref_field where record_code='" + record_code + "';"
    query += "delete from " + db + ".record_info where record_code='" + record_code + "';"
    /*  if (obj.res_tech_name != null) {
         query += "drop table if exists " + schema_name + "." + obj.res_tech_name + ";"
     } */


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
                }
                mysqlCon.query(query, function (error1, results1) {
                    if (error1) {
                        console.log("Error-->routes-->projectMetadata-->businessResourceData-->deleteRecord-->", error)
                        objectToSend["error"] = true;
                        objectToSend["data"] = "Some error occured at server Side. Please try again later"
                        res.send(objectToSend)
                        mysqlCon.rollback()
                        mysqlCon.release();
                    } else {
                        var query = "drop table if exists " + obj.database_name + "." + obj.table_name + ";"
                        mysqlCon.query(query, function (error1, results1) {
                            if (error1) {
                                console.log("Error-->routes-->projectMetadata-->businessResourceData-->deleteRecord-->", error)
                                objectToSend["error"] = true;
                                objectToSend["data"] = "Some error occured at server Side. Please try again later"
                                res.send(objectToSend)
                                mysqlCon.release();
                            } else {
                                objectToSend["error"] = false;
                                objectToSend["data"] = "Record deleted successfully"
                                res.send(objectToSend)
                                mysqlCon.release();
                            }
                        })


                    }
                })
            })
        }
    })
})

router.post('/createprocess', (req, res) => {
    let obj = req.body;

    let objectToSend = {}
    let db = "svayam_" + obj.b_acct_id + "_md";

    let sql_insert = "insert into " + db + ".process_info (process_code,process_name,is_active) values"
        + " (" + SqlString.escape(obj.process_code) + "," + SqlString.escape(obj.process_name) + "," + SqlString.escape(obj.is_active) + ") "

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

router.delete('/deleteprocess:dtls', (req, res) => {
    let obj = JSON.parse(req.params.dtls)
    let objectToSend = {}
    let process_code = obj.process_code

    let db = "svayam_" + obj.b_acct_id + "_md";

    let sql_deleteFld = "delete from " + db + ".process_info where process_code='" + process_code + "'"
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

router.put('/updateprocess', (req, res) => {
    let obj = req.body
    let db = "svayam_" + obj.b_acct_id + "_md";

    let objectToSend = {}

    let sql = "update " + db + ".process_info set process_code=" + SqlString.escape(obj.process_code) + ",process_name=" + SqlString.escape(obj.process_name) + ","
        + "is_active=" + SqlString.escape(obj.is_active) + " where process_code=" + SqlString.escape(obj.old_process_code) + ";"




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

router.post('/createDomain',(req,res)=>{
    let objectToSend={}

    let obj=req.body

    let domain_code=obj["domain_code"]
    let domain_tech_name=obj["domain_technical_name"]
    let domain_name=obj["domain_name"]
    let b_acct_id=obj["b_acct_id"]


    let sql_insertDomain="insert into svayam_"+b_acct_id+"_md.domain_info (domain_code,domain_name,domain_technical_name) values "
                    +" ("+SqlString.escape(domain_code)+","+SqlString.escape(domain_name)+","+SqlString.escape(domain_tech_name)+")"

    mysqlPool.getConnection(function(error,mysqlCon){
        if(error){
            console.log("Error-->routes-->metadata-->processMetadata-->metadata-->createDomain--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            mysqlCon.beginTransaction(function(error1){
                if(error1){
                    console.log("Error-->routes-->metadata-->processMetadata-->metadata-->createDomain--", error1)
                    objectToSend["error"] = true
                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                    res.send(objectToSend);
                    mysqlCon.release()
                }else{
                    mysqlCon.query(sql_insertDomain,function(error2,results2){
                        if(error2){
                            console.log("Error-->routes-->metadata-->processMetadata-->metadata-->createDomain--", error2)
                            objectToSend["error"] = true

                            if(error2.message.includes("Duplicate")){
                                objectToSend["data"] = error2.message
                            }else{
                                objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                            
                            }
                            res.send(objectToSend);
                            mysqlCon.rollback()
                            mysqlCon.release()
                        }else{
                            let domain_id=results2.insertId
                            let sql_createDb="create database "+domain_tech_name+" COLLATE='utf8_unicode_ci'"

                            mysqlCon.query(sql_createDb,function(error3,results3){
                                if(error3){
                                    console.log("Error-->routes-->metadata-->processMetadata-->metadata-->createDomain--", error3)
                                    objectToSend["error"] = true
                                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                                    res.send(objectToSend);

                                    let manual_rollback="delete from svayam_"+b_acct_id+"_md.domain_info where domain_id="+domain_id
                                    mysqlCon.query(manual_rollback,function(error4,results4){
                                        if(error4){
                                            console.log("Error-->routes-->metadata-->processMetadata-->metadata-->createDomain-->Unable to roll back manually--", error4)
                                        }
                                    })

                                    mysqlCon.release()

                                }else{
                                    objectToSend["error"] = false
                                    objectToSend["data"] = "Domain created successfully"
                                    res.send(objectToSend);
                                    mysqlCon.release();
                                }
                            })
                        }
                    })
                }
            })
        }
    })


})

router.put('/updateDomain',(req,res)=>{
    let objectToSend={}
    let obj=req.body

    let domain_name=obj["domain_name"]
    let b_acct_id=obj["b_acct_id"]
    let domain_code=obj["domain_code"]

    let sql_updateDomain="update svayam_"+b_acct_id+"_md.domain_info set domain_name="+SqlString.escape(domain_name)+" where "
                    +" domain_code="+SqlString.escape(domain_code)

    mysqlPool.query(sql_updateDomain,function(error,results){
        if(error){
            console.log("Error-->routes-->metadata-->processMetadata-->metadata-->updateDomain--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Domain name updated successfully"
            res.send(objectToSend);
        }
    })

    
})

router.delete('/deleteDomain:dtls',(req,res)=>{
    let objectToSend={}

    let obj=JSON.parse(req.params.dtls)

    let b_acct_id=obj["b_acct_id"]
    let domain_code=obj["domain_code"]
    let domain_tech_name=obj["domain_technical_name"]

    let sql_checkPresence="Select * from svayam_"+b_acct_id+"_md.record_info where domain_code="+SqlString.escape(domain_code)+" limit 1"

    mysqlPool.query(sql_checkPresence,function(error2,results2){
        if(error2){
            console.log("Error-->routes-->metadata-->processMetadata-->metadata-->deleteDomain--", error2)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else if(results2.length!=0){
            objectToSend["error"] = true
            objectToSend["data"] = "Can' delete this domain as it is contains few records"
            res.send(objectToSend);
        }else{
            mysqlPool.getConnection(function(error,mysqlCon){
                if(error){
                    console.log("Error-->routes-->metadata-->processMetadata-->metadata-->deleteDomain--", error)
                    objectToSend["error"] = true
                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                    res.send(objectToSend);
                }else{
                    mysqlCon.beginTransaction(function(error1){
                        if(error1){
                            console.log("Error-->routes-->metadata-->processMetadata-->metadata-->deleteDomain--", error1)
                            objectToSend["error"] = true
                            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                            res.send(objectToSend);
                            mysqlCon.release()
                        }else{
                            let sql_deleteDomain="delete from svayam_"+b_acct_id+"_md.domain_info where domain_code="+SqlString.escape(domain_code)
                            let sql_dropDb="drop database "+domain_tech_name
                            mysqlCon.query(sql_deleteDomain+";"+sql_dropDb,function(error3,results3){
                                if(error3){
                                    console.log("Error-->routes-->metadata-->processMetadata-->metadata-->deleteDomain--", error3)
                                    objectToSend["error"] = true
                                    objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
                                    res.send(objectToSend);
                                    mysqlCon.rollback()
                                    mysqlCon.release()
                                }else{
                                    objectToSend["error"] = false
                                    objectToSend["data"] = "Domain deleted successfully"
                                    res.send(objectToSend);
                                    mysqlCon.release()
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    
})


module.exports = router;