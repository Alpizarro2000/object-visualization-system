// Server.js
const cors = require('cors');

var express = require('express');
var app = express();
app.use(cors());
app.use(express.json());

var sql = require("mssql");

// config for your database
var config = {
    user: 'steve',
    password: 'perro4000',
    server: 'ARGO\\SQLEXPRESS', 
    port: 1433,
    database: 'OVS',
    trustServerCertificate: true,
};

app.get('/api/scenes/:id', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "exec uspReturnLatestSceneContents " + req.params.id;
        console.log(req.params.id)
        console.log(statement);
        request.query(statement, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});

app.listen(2023, () => console.log("Listening on port "));
