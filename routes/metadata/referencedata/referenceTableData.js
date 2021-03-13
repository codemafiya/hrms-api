var express = require('express');
var router = express.Router();
var SqlString = require('sqlstring');

var propObj = require('../../../config_con.js')
let mysqlPool = require('../../../connections/mysqlConnection.js');


router.get('/getreferencedata:dtls', (req, res) => {

    let objectToSend = {}


    let b_acct_id = req.params.dtls;


    let db = "svayam_" + b_acct_id + "_md";

    let sql_fetchCurr = "SELECT r.record_code,r.record_business_name,r.record_technical_name,r.domain_code,r.status,"
        + "  GROUP_CONCAT(d.field_business_name ORDER BY x.col_seq_no) AS field_business_name,"
        + " GROUP_CONCAT(d.field_technical_name ORDER BY x.col_seq_no) AS field_technical_name "
        + "  FROM (SELECT * FROM " + db + ".record_info WHERE record_type='reference' and reference_data_type!='code_value') r JOIN " + db + ".record_xref_field x ON r.record_code=x.record_code "
        + "  JOIN " + db + ".field_info d ON x.field_code=d.field_code GROUP BY r.record_code,r.record_business_name,r.record_technical_name,r.domain_code,r.status"


    mysqlPool.query(sql_fetchCurr, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getreferencedata--", error)
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

router.get('/getrecorddtl:dtls', (req, res) => {

    let objectToSend = {}


    let obj = JSON.parse(req.params.dtls);

    let db = "svayam_" + obj.b_acct_id + "_md";

    let sql_fetchFldCode = "Select field_code  from " + db + ".record_xref_field where record_code=" + SqlString.escape(obj.record_code)+" ORDER BY col_seq_no"


    mysqlPool.query(sql_fetchFldCode, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getreferencedata--", error)
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

router.post('/insertReferenceData', (req, res) => {

    let objectToSend = {}

    let obj = req.body;
    let data = obj.data;
    let database_name = obj.database_name

    let table_name = obj.table_name
    let arr = Object.keys(data);

    let query = "insert into " + database_name + "." + table_name + " (" + arr.join(",") + ") values ("
    for (let i = 0; i < arr.length; i++) {

        query += SqlString.escape(data[arr[i]])
        if (i < arr.length - 1) {
            query += ","
        }
    }
    query += ")"


    mysqlPool.query(query, function (error, results) {
        if (error) {
            console.log("Error-->routes-->referenceData-->referenceTableData-->insertReferenceData--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = "Inserted Successfully"

            res.send(objectToSend);
        }
    })
})


router.delete('/deleteReferenceData:dtls', (req, res) => {

    let objectToSend = {}

    let obj = JSON.parse(req.params.dtls);

    let database_name = obj.database_name

    let table_name = obj.table_name
    let updKey=obj["update_key"]
    let updVal = obj[updKey]

    let query = "delete from " + database_name + "." + table_name + " where "+updKey+" in (" + updVal + ")"


    mysqlPool.query(query, function (error, results) {
        if (error) {
            console.log("Error-->routes-->referenceData-->referenceTableData-->deleteReferenceData--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = "Deleted Successfully"

            res.send(objectToSend);
        }
    })
})


router.post('/truncateReferenceData', (req, res) => {

    let objectToSend = {}

    let obj = req.body;
    let database_technical_name = obj.database_tech_name

    let table_technical_name = obj.table_tech_name


    let query = "truncate table " + database_technical_name + "." + table_technical_name


    mysqlPool.query(query, function (error, results) {
        if (error) {
            console.log("Error-->routes-->referenceData-->referenceTableData-->truncateReferenceData--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = "Inserted Successfully"

            res.send(objectToSend);
        }
    })
})


router.put('/updateReferenceData', (req, res) => {

    let objectToSend = {}

    let obj = req.body;
    let data = obj.data;
    let database_name = obj.database_name

    let table_name = obj.table_name

    let arr = Object.keys(data);

    let updKey=obj["update_key"]

    


    let query = "update " + database_name + "." + table_name + " set "
    for (let i = 0; i < arr.length; i++) {

        

        query += arr[i] + "=" + SqlString.escape(data[arr[i]])
        if (i < arr.length - 1) {
            query += " , "
        }
    }
    query += " where "+updKey+"= " + data[updKey]

    

    mysqlPool.query(query, function (error, results) {
        if (error) {
            console.log("Error-->routes-->referenceData-->referenceTableData-->updateReferenceData--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = "Updated successfully"

            res.send(objectToSend);
        }
    })
})


router.get('/getReferencevalues:dtls', (req, res) => {

    let objectToSend = {}

    let obj = JSON.parse(req.params.dtls);


    let database = obj.database_name
    let table_name = obj.table_name



    let query = "select * from  " + database + "." + table_name
    mysqlPool.query(query, function (error, results) {
        if (error) {
            console.log("Error-->routes-->referenceData-->referenceTableData-->getReferenceData--", error)
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