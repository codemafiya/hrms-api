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


var productTables={

    "hrms":["bank_dtl","bill","bill_item","emp_info","fix_pay","posting","var_pay","code_value","leave_rule","pay","attendance","leave_app","emp_xref_leave","establishment"]
}



////Product Codes/ Domain Codes


module.exports={  
    
    //mysql connection props
    mysqlConProp:mysqlConProp,
    productTables: productTables,
    
   
  

    //email configurations
    senderEmail:senderEmail,
    senderPass:senderPass,

    encryptionKey:encryptionKey,

   db: db

    

}