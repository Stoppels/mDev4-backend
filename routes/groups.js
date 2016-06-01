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
	var TYPES = require('tedious').TYPES;

	function executeStatement() {
	    request = new Request("SELECT * FROM [LVS].[Group]", function(err) {
	        if (err) {
	            console.log("err: " + err);}
	    });

	    var resultTotal = [];

	    var promise = new Promise(function(resolve, reject) {
			
	    	request.on('row', function(columns) {

	    		var group = {};

		        columns
		        	.map(function(row) {

		        		switch(row.metadata.colName) {
						    case "id":
						        group.id = row.value;
						        break;
						    case "name":
						        group.name = row.value;
						        break;
					        case "current_academic_year":
						        group.current_academic_year = row.value;
						        break;
					        case "current_year_of_study":
						        group.current_year_of_study = row.value;
						        break;
					        case "start_year":
						        group.start_year = row.value;
						        resultTotal.push(group);
						        break;
						    default:
						        group.error = row.value;
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
	var TYPES = require('tedious').TYPES;

	function executeStatement() {
	    request = new Request(`SELECT [Group].id AS group_id, [Group].name, [Group].current_academic_year, 
	    								[Group].current_year_of_study, [Group].start_year
									FROM [LVS].[Group]
									WHERE [LVS].[Group].id = ${id}

	    						SELECT [Student].id AS student_id, [Student].student_code, [Student].particulars, [Student].birth_date,
	    								[Student].first_name, [Student].middle_name, [Student].last_name, [Student].sex
	    							FROM [LVS].[Student] 
	    							LEFT JOIN [LVS].[Student_Group] ON [LVS].[Student].id = [LVS].[Student_Group].student_id
	    							WHERE [LVS].[Student_Group].group_id = ${id}`, function(err) {
	        if (err) {
	            console.log("err: " + err);}
	    });

	    var resultTotal = [];

	    var promise = new Promise(function(resolve, reject) {
			
	    	request.on('row', function(columns) {

	    		var group = {};
	    		var student = {};

		        columns
		        	.map(function(row) {
		        		console.log(row);

		        		switch(row.metadata.colName) {
		        			case "group_id":
		        				group.id = row.value;
		        				break;
						    case "name":
						        group.name = row.value;
						        break;
					        case "current_academic_year":
						        group.current_academic_year = row.value;
						        break;
					        case "current_year_of_study":
						        group.current_year_of_study = row.value;
						        break;
					        case "start_year":
						        group.start_year = row.value;
						        resultTotal.push(group);
						        break;
				        	
				        	case "student_id": 
				        		student.id = row.value;
				        		break;
						    case "student_code":
						        student.student_code = row.value;
						        break;
					        case "particulars":
						        student.particulars = row.value;
						        break;
					        case "birth_date":
						        student.birth_date = row.value;
						        break;
					        case "first_name":
						        student.first_name = row.value;
						        break;
					        case "middle_name":
					        	student.middle_name = row.value;
					        	break;
				        	case "last_name":
				        		student.last_name = row.value;
				        		break;
			        		case "start_year":
			        			student.start_year = row.value;
			        			break;
		        			case "sex":
		        				student.sex = row.value;
						        resultTotal.push(student);
						        break;
						    default:
						        student.error = row.value;
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

module.exports = router;
