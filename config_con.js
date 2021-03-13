//mysql connection  variables
var mysqlHost="localhost";

var mysqlUser="root";
var mysqlPwd="root";


///Password encryption key

var encryptionKey='d6387ed9704181f860122340e5a042d661afb50211cf45903c01026db4d756cd'

//databases used
var db = "hrms";



////email props
var senderEmail="support@svayamtech.com";
var senderPass="fun2support"





var mysqlConProp={
    host: mysqlHost, //mysql database host name
    user: mysqlUser, //mysql database user name
    password: mysqlPwd, //mysql database password
    multipleStatements: true
}


// var productTables={
//     "svayam_md":["datatype_info","domain_info","field_info","functional_resources","functional_roles","functional_role_xref_functional_resource","process_info",
//                 "record_info","record_xref_field","uploaded_file_info","user_xref_functional_role","svayam_code_value"],
//     "svayam_data":["activity_status","audit","batch_status","events","events_info","financial_process_info","ip","jrnl","period_close","period_close_date",
//                 "period_xref_account","ppd_info","ref_account","ref_exchange_rate","ref_iue_account","ref_organisation","ref_reclass_account",
//                 "rule","rule_lookups","rule_xref_input_file","sal","saved_reports","source_info","saved_record"]
// }



////Product Codes/ Domain Codes


module.exports={  
    
    //mysql connection props
    mysqlConProp:mysqlConProp,

    
   
  

    //email configurations
    senderEmail:senderEmail,
    senderPass:senderPass,

    encryptionKey:encryptionKey,

   db: db

    

}