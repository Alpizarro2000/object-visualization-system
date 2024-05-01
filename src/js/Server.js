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

app.get('/api/scenes', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "exec uspReturnAllSceneInfo";
        console.log(statement);
        request.query(statement, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});

app.get('/api/scenes/:scene_id/:scene_date', function (req, res) {
    const sceneId = req.params.scene_id;
    const sceneDate = req.params.scene_date;

    // Check if sceneId is null or undefined
    if (!sceneId) {
        return res.status(400).send('Scene ID is required');
    }

    // connect to your database
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "exec uspReturnSceneContents " + sceneId + ", '" + sceneDate + "'";
        console.log(statement);
        
        request.query(statement, function (err, recordset) {
            if (err) {
                console.log(err);
                return res.status(500).send('Error executing database query');
            }

            // Check if recordset is undefined or null
            if (!recordset) {
                return res.status(404).send('Scene not found');
            }

            // send records as a response
            res.send(recordset.recordset);
        });
    });
});



app.get('/api/dates/:scene_id', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "exec uspReturnAllVersionDates " + req.params.scene_id;
        console.log(statement);
        request.query(statement, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});

app.get('/api/files', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        var statement = "exec uspReturnAllAvailableModels";
        console.log(statement);
        request.query(statement, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset.recordset);
            
        });
    });
    
});

app.listen(2023, () => console.log("Listening on port "));
