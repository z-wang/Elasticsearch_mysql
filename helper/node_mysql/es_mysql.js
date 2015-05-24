/**
 * Created by zihanwang on 5/23/15.
 */
/*
 This function will be used for update information between mysql and elasticsearch
  */
var mysql = require('mysql');
var http  = require('http');

var connection = mysql.createConnection({
    host: '',
    user     : ,
    password : '',
    database : 'dreamguide'
});

var baseInfo = {
    http : 'http://',
    url : 'localhost',
    port : '9200',
    query : 'select * from ',
    dbname : 'dreamguide',
    token : '/',
    token2 : ':'
};


var updateRow = function(data, indice, type){
    var postData = JSON.stringify(data);
    var postOption = {
        host: baseInfo.url,
        port: baseInfo.port,
        path: '/'+ indice +'/'+ type +'/'+ data.id,
        method: 'POST'
    };
    var postReq = http.request(postOption, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            console.log('Response: '+ chunk);
        })
    });
    postReq.write(postData);
    console.log(postData);
    postReq.end();
};

var executeQuery = function( query, indice, type) {
    connection.connect();

    connection.query(query, function (err, results, fields) {
        if (!err) {
            (function loopReq (i) {
                setTimeout(function () {
                    if (--i) {
                        updateRow(results[i], indice, type);
                        loopReq(i);
                    }
                }, 200)
            })(results.length);
            //results.forEach(function(data){
            //    setTimeout(updateRow(data, indice, type), 500);
            //});
            //results.map(function(data){
            //    setTimeout(updateRow(data), 300);
            //});
            //results.map(function(data){
            //    var index = {
            //        index:{
            //            _id:data.id
            //        }
            //    };
            //    resultsArr.push(JSON.stringify(index)+JSON.stringify(data));
            //});
            //console.log(resultsArr);
        }
        else
            console.log('Error while performing Query.', err);
    });

    connection.end();
};

var urlGen = function( tableName ){
    return baseInfo.http + baseInfo.url +baseInfo.token2 + baseInfo.port
        + baseInfo.token + baseInfo.dbname + baseInfo.token + tableName +
        baseInfo.token ;
};

var queryGen = function( tableName ) {
    return baseInfo.query + tableName;
};

executeQuery(queryGen('schools'),'dreamguide', 'schools');


/*
    what table to insert to elasticsearch

 */

/*
    what query to elasticsearch

 */

