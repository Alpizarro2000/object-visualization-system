// Server.js
const cors = require('cors');

var express = require('express');
var app = express();
app.use(cors());
app.use(express.json());

var sql = require("mssql");

// config for your database
var config = {
    user: 'alex',
    password: 'pates',
    server: 'NAUT\\SQLEXPRESS', 
    port: 1433,
    database: 'OVS',
    trustServerCertificate: true,
};

// Read
app.get('/api/files/:id', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "select * from files where file_id = " + req.params.id;
        console.log(statement);
        request.query(statement, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset[0]);
            
        });
    });
    
});

// Create
app.post('/api/files', (req, res) => {
    sql.connect(config, err => {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to connect to database.');
        } else {
            const request = new sql.Request();
            console.log(req.body);
            const { file_name, file_path } = req.body;
            var statement = `INSERT INTO files (file_id, file_name, file_path) VALUES (((SELECT max(file_id) as last FROM files)+1), '${file_name}', '${file_path}')`;
            console.log(statement);
            request.query(statement, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Failed to create entry.');
            } else {
                res.status(201).send('Successful entry.');
            }
            });
        }
    });
});

app.get('/api/client/:id', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "select * from client where client_id = '" + req.params.id + "'"; 
        console.log(statement);
        request.query(statement, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset[0]);
            
        });
    });
    
});

// Create
app.post('/api/client', (req, res) => {
    sql.connect(config, err => {
        if (err) {
            console.log(err);
            res.status(500).send('Failed to connect to database.');
        } else {
            const request = new sql.Request();
            const { client_name } = req.body;
            var statement = `INSERT INTO clients (client_id, client_name) VALUES (((SELECT max(client_id) as last FROM clients)+1), '${client_name}')`;
            console.log(statement);
            request.query(statement, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Failed to create entry.');
            } else {
                res.status(201).send('Successful entry.');
            }
            });
        }
    });
});

app.listen(2023, () => console.log("Listening on port "));
