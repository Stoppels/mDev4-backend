var express = require('express');
var router = express.Router();

var Connection = require('tedious').Connection;
var config = require('../config');

/* GET users listing. */
router.get('/', function(req, res) {
    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;
//    var TYPES = require('tedious').TYPES;

    function executeStatement() {
        request = new Request("SELECT * FROM [LVS].[User] ", function(err) {
            if (err) {
                console.log("err: " + err);
            }
        });

        var resultTotal = [];

        var promise = new Promise(function(resolve, reject) {
            
            request.on('row', function(columns) {

                var user = {};

                columns
                    .map(function(row) {

                        switch(row.metadata.colName) {
                            case "id":
                                user.id = row.value;
                                break;
                            case "username":
                                user.username = row.value;
                                break;
                            case "password":
                                user.password = row.value;
                                break;
                            case "clearance":
                                user.clearance = row.value;
                                break;
                            case "email":
                                user.email = row.value;
                                break;
                            case "phone":
                                user.phone = row.value;
                                break;
                            case "first_name":
                                user.first_name = row.value;
                                break;
                            case "last_name":
                                user.last_name = row.value;
                                break;
                            case "sex":
                                user.sex = row.value;
                                resultTotal.push(user);
                                break;
                            default:
                                user.error = row.value;
                        }
                        
                    });

                resolve(resultTotal);   
            });

        });

        promise.then(function(result) {
            res.json(result);
        })
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.get('/:id', function(req, res) {
    var id = req.params.id;

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`SELECT * FROM [LVS].[User] AS userInfo WHERE userInfo.id = ${id}`, function(err) {
            if (err) {
                console.log("err: " + err);}
        });

        var promise = new Promise(function(resolve, reject) {
            
            request.on('row', function(columns) {

                var user = {};

                columns
                    .map(function(row) {

                        switch(row.metadata.colName) {
                            case "id":
                                user.id = row.value;
                                break;
                            case "uesrname":
                                user.uesrname = row.value;
                                break;
                            case "password":
                                user.password = row.value;
                                break;
                            case "email":
                                user.email = row.value;
                                break;
                            case "phone":
                                user.phone = row.value;
                                break;
                            case "first_name":
                                user.first_name = row.value;
                                break;
                            case "last_name":
                                user.last_name = row.value;
                                break;
                            default:
                                user.error = row.value;
                        }
                        
                    });

                resolve(user);   
            });

        });

        promise.then(function(result) {
            res.json(result);
        })
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.post('/login', function(req, res) {
    var data = {
        username: req.body.username,
        password: req.body.password
    };

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`SELECT * FROM [LVS].[User] WHERE [username] = '${data.username}' AND [active] = 1`, function(err) {
            if (err) {
                console.log("err: " + err);}
                res.send("error:" + err);
        });

        var promise = new Promise(function(resolve, reject) {
            
            request.on('row', function(columns) {

                var user = {};

                columns
                    .map(function(row) {

                        switch(row.metadata.colName) {
                            case "id":
                                user.id = row.value;
                                break;
                            case "username":
                                user.username = row.value;
                                break;
                            case "password":
                                user.password = row.value;
                                break;
                            case "clearance":
                                user.clearance = row.value;
                                break;
                            case "email":
                                user.email = row.value;
                                break;
                            case "phone":
                                user.phone = row.value;
                                break;
                            case "first_name":
                                user.first_name = row.value;
                                break;
                            case "last_name":
                                user.last_name = row.value;
                                break;
                            case "sex":
                                user.sex = row.value;
                                break;
                            default:
                                user.error = row.value;
                        }

                    });

                resolve(user);  
            });

        });

        promise.then(function(user) {
            if (data.password === user.password) {
                res.json(user);
            } else {
                res.json({error: "Login failed"});
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.post('/create', function(req, res) {
    var data = {
        username: req.body.username,
        password: req.body.password,
//        clearance: req.clearance,
        email: req.body.email,
        phone: req.body.phone,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex
    };

    console.log(data);

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`INSERT INTO [LVS].[User] ([username], [password], [email], [phone], [first_name], [last_name], [sex]) VALUES ('${data.username}', '${data.password}', '${data.email}', '${data.phone}', '${data.first_name}', '${data.last_name}',
	 '${data.sex}');`, function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json({success: "User created successfully!"});
                console.log("User created successfully!");
                }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

router.post('/deactivate', function(req, res) {
    var id = req.body.id;

    // connect database
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        executeStatement();
    });

    // execute a query
    var Request = require('tedious').Request;

    function executeStatement() {
        request = new Request(`UPDATE [LVS].[User] SET [active] = 0 WHERE id = '${id}';`, function(err) {
            if (err) {
                console.log("err: " + err);
                res.json({error: err});
            } else {
                res.json({success: "User deactivated successfully!"});
                console.log("User deactivated successfully!");
            }
        });
       
        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }
});

module.exports = router;