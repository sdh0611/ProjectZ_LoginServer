var fs = require('fs');

var mysqlDB;

function connectDB(database){
    mysqlDB = database;
}



function start(req, res){

    console.log('start');
    res.redirect('/login');

}


// regist
function showRegistForm(req, res){
    console.log('registform');
    fs.readFile('./regist.html', function(error, html){
        if(error){
            res.send(error);
        }else{
            res.send(html.toString());
        }

    });
}

function regist(req, res){

    var data = {
        id : req.body.id,
        password : req.body.password,
        nickname : req.body.nickname
    };

    console.log('regist : ' + data);
    mysqlDB.regist(res, data);

}


// read
function showLoginForm(req, res){
    console.log('loginForm');
    fs.readFile('./login.html', function(error, html){
        if(error){
            res.send(error);
        }else{
            res.send(html.toString());
        }

    });
}

function login(req, res){
    var data = {
        id : req.body.id,
        password : req.body.password
    };

    console.log('login : ' + data.id + ', password : ' + data.password);
    mysqlDB.login(res, data);

}


function logout(req, res){
    var data = {
        id : req.body.id,
    };

    console.log('login ' + data.id);
    mysqlDB.logout(res, data);

}


module.exports = {
    connectDB : connectDB,
    start : start,
    
    showRegistForm : showRegistForm,
    showLoginForm : showLoginForm,

    regist : regist,
    login : login,
    logout : logout
};