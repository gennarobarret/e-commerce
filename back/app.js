require('dotenv').config();

'use strict';

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 4201;

const auth_route = require('./routes/authRoute');
const user_route = require('./routes/userRoute');
const initialConfig_route = require('./routes/initialConfigRoute');


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
app.use('/api', initialConfig_route);
app.use('/api', auth_route);
app.use('/api', user_route);


module.exports = app;
