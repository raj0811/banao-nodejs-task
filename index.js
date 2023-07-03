const express = require('express');
const app=express();
const port =8003
const db = require('./config/mongoose');
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(express.json());
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));


app.use('/', require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log("error in starting server");
        
    }
    console.log('server start on port',port);
})