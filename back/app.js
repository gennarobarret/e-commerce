require('dotenv').config();

'use strict';

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;

var admin_route = require('./routes/admin');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(port, function () {
            console.log('** Server online on port ' + port + '**');
        });
    })
    .catch((error) => {
        console.error('** Database Connection Failed:', + error + '**');
    });



// Parse incoming JSON objects
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

// CORS permissions
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method'
    );
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// Initialize routes
app.use('/api', admin_route);


module.exports = app;
