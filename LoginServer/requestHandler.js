var fs = require('fs');
var gameLift = require('./gameLift');

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

    console.log('[Server] Request regist : ' + data);
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

    console.log('[Server] Reqeust login ID : ' + data.id + ', Password : ' + data.password);
    mysqlDB.login(res, data);

}


function logout(req, res){
    var data = {
        id : req.body.id,
    };

    console.log('[Server] Request logout ' + data.id);
    mysqlDB.logout(res, data);

}


function matchGame(req, res){
    var data = {
        ip : req.body.ip,
    };

    console.log('[Server] Request match game');
    mysqlDB.matchGame(res, data);
}

function createGame(req, res){
    var data = {
        ip : req.body.ip,
        CanJoin : false
    };

    console.log('[Server] Request create game');
    mysqlDB.createGame(res, data);

}

function deleteGame(req, res){
    var data = {
        ip : req.body.ip,
    };

    console.log('[Server] Request delete game');
    mysqlDB.deleteGame(res, data);

}


function startGame(req, res){
    var data = {
        ip : req.body.ip,
    };

    console.log('[Server] Request create game');
    mysqlDB.startGame(res, data);

}

function createGameSession(req, res){
    console.log('[Server] Create session.');
    gameLift.createGameSession(req, res);
}

function describeGameSession(req, res){
    console.log('[Server] Describe game session.');
    gameLift.describeGameSession(req, res);
}

function createPlayerSession(req, res){
    console.log('[Server] Create player session.');
    gameLift.createPlayerSession(req, res);
}

function searchGameSessions(req, res){
    console.log('[Server] Search game sessions.');
    gameLift.searchGameSessions(req, res);
}




module.exports = {
    connectDB : connectDB,
    start : start,
    
    showRegistForm : showRegistForm,
    showLoginForm : showLoginForm,

    regist : regist,
    login : login,
    logout : logout,
    matchGame : matchGame,
    createGame : createGame,
    deleteGame : deleteGame,
    startGame : startGame,

    createGameSession : createGameSession,
    describeGameSession : describeGameSession,
    createPlayerSession : createPlayerSession,
    searchGameSessions : searchGameSessions
};