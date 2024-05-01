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

app.post('/api/UploadNewModelChanges', function (req, res) {
    // Extract parameters from request body
    const { model_instance_id, file_id, date_and_time, position, scale, rotation } = req.body;

    // Connect to the database
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        // Create Request object
        const request = new sql.Request();

        // Set input parameters for the stored procedure
        request.input('p_model_instance_id', sql.Int, model_instance_id);
        request.input('p_file_id', sql.NVarChar(255), file_id);
        request.input('p_date_and_time', sql.DateTime, date_and_time);
        request.input('p_position', sql.NVarChar(255), position);
        request.input('p_scale', sql.NVarChar(255), scale);
        request.input('p_rotation', sql.NVarChar(255), rotation);

        // Execute the stored procedure
        request.execute('uspInsertOrUpdateContentChanges', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send('Error executing database query');
            }

            // Return success response
            res.send('Content changes inserted or updated successfully');
        });
    });
});

app.post('/api/UploadNewModelChanges', function (req, res) {
    // Extract parameters from request body
    const { scene_id, file_id, date_and_time, position, scale, rotation } = req.body;

    // Connect to the database
    sql.connect(config, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        // Create Request object
        const request = new sql.Request();

        // Set input parameters for the stored procedure
        request.input('p_scene_id', sql.Int, scene_id);
        request.input('p_file_id', sql.NVarChar(255), file_id);
        request.input('p_date_and_time', sql.DateTime, date_and_time);
        request.input('p_position', sql.NVarChar(255), position);
        request.input('p_scale', sql.NVarChar(255), scale);
        request.input('p_rotation', sql.NVarChar(255), rotation);

        // Execute the stored procedure
        request.execute('uspInsertNewModelInstanceAndChange', function (err, recordset) {
            if (err) {
                console.log(err);
                return res.status(500).send('Error executing database query');
            }

            // Return the response with the new model_instance_id
            const new_model_instance_id = recordset.output.new_model_instance_id;
            res.send({ new_model_instance_id: new_model_instance_id });
        });
    });
});


app.listen(2023, () => console.log("Listening on port "));
