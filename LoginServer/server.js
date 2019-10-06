var http = require('http');
var express = require('express');

var bodyParser = require('body-parser');

var app = express();


function setRouter(app, rule){

    for(var key in rule){
        if(rule[key].method === 'GET'){
            app.get(rule[key].path, rule[key].function);
        }else if(rule[key].method === 'POST'){
            app.post(rule[key].path, rule[key].function);
        }

    }

}

function startServer(rule){

    app.use(bodyParser());

    setRouter(app, rule);

    http.createServer(app).listen(8000, function(){
        console.log('[Server] Server running..');
    });

}

module.exports = {
    startServer : startServer
};