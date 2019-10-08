var mysql = require('mysql');

var client = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'qwer1234',
    database : 'userdb'
});

client.connect(function(error){
    if(error){
        console.log(error);
    }
})


function regist(res, data){
    console.log('[Server] In regist.');
    var queryString = "select * from userdb.userinfo where id=?";
    client.query(queryString, data.id, function(error, results){
        if(error){
            console.log('[Server] Failed to regist : ' + error);
            // res.send('Query error : ' + error);
            res.send('{result : false}');
        }else{ 
           
            if(results.length > 0){
                // res.send('ID already exist');        
                console.log('[Server] Failed to regist : ID already exist.');             
                res.send('{result : false}');        
            }else{
                queryString = "insert into userdb.userinfo set?";
                client.query(queryString, data, function(error, results){
                    if(error){
                        console.log('[Server] Failed to regist : ' + error);
                        // res.send('Failed to create new data : '+error);
                        res.send('{result : false}');        
                    }else{

                        if(results.affectedRows > 0)
                        {
                            res.send('{result : true}');
                        }else{
                            console.log('[Server] Failed to regist. ');
                            res.send('{result : false}');
                        }
                        
                    }
            
                });
            }
        
        }
    });
}

function login(res, data){
    console.log('[Server] In login');
    
    var queryString = "select * from userdb.userinfo where id=? and password=?";
    client.query(queryString, [data.id, data.password], function(error, results){
        if(error){
            console.log('[Server] Failed to login : ' + error);
            res.send('{"result" : "false"}')
        }else{
            console.log('[Server] ID : ' + data.id + ", PW : " + data.password);
            if(results.length > 0){
                var nickname = results[0].nickname;

                if(false == results[0].isconnect){
                    console.log('[Server] Set "isconnect" true.');
                    queryString = "update userinfo set isconnect=true where id=?";
                    client.query(queryString, [data.id], function(error, results){
                        if(error){
                            console.log('[Server] : Failed to login : ' + error);
                            res.send('{"result" : "false"}');
                        }else{
                            if(results.affectedRows > 0){
                                var sendData = {
                                    result : "true",
                                    id : data.id,
                                    nickname : nickname
                                };
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(sendData));
                                
                            }else{
                                console.log('[Server] : Failed to login : unknown.');
                                res.send('{"result" : "false"}');
                            }
                        }
                    });

                }else{
                    console.log('[Server] Failed to login : already login. ');
                    res.send('{"result" : "false", "reason" : "이미 로그인 되어있습니다."}');
                }
            
            }else{
                console.log('[Server] Failed to login : not exist. ');
                res.send('{"result" : "false", "reason" : "일치하는 정보가 없습니다."}');
            }
        }        
    });

}

function logout(res, data){
    console.log('In Logout');
    
    var queryString = "update userinfo set isconnect=false where id=?";
    client.query(queryString, [data.id], function(error, results){
        console.log('[Server] ID : ' + data.id);
        if(error){
            res.send('[Server] Failed to logout ' + error);
        }else{
            console.log(data.id);
            if(results.affectedRows > 0){
                res.send('{"result" : "true"}');
            }else{
                res.send('{"result" : "false"}');
            }
        }
        
    })

}

function matchGame(res, data){
    console.log('In match');
    
    var queryString = "select CanJoin from userdb.matchgame where ip=?";
    client.query(queryString, [data.ip], function(error, results){
        console.log('[Server] IP : ' + data.ip);
        if(error){
            console.log('[Server] Failed to match ' + error);
        }else{
            console.log(data.ip);
            if(results.length > 0){
                if(false == results[0].CanJoin){
                    console.log('[Server] : Success to match game!!');
                    var sendData={
                        result : "true",
                        ip : data.ip
                    };
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(sendData));
                }else{
                    console.log('[Server] Game already start..');
                    res.send('{"result" : "false", "reason" : "이미 시작된 게임입니다."}');
                }
            }else{
                console.log('[Server] : Game not exist..');
                res.send('{"result" : "false", "reason" : "존재하지 않는 게임입니다."}');
            }
        }
        
    })

}

function createGame(res, data){
    console.log('In create game');
    
    var queryString = "insert into userdb.matchgame set?";
    client.query(queryString, data, function(error, results){
        console.log('[Server] IP : ' + data.ip);
        if(error){
            console.log('[Server] Failed to create game ' + error);
            res.send('{"result" : "false"}');
        }else{
            console.log(data.ip);
            if(results.affectedRows > 0){
                console.log('[Server] : Success create game!!');
                res.send('{"result" : "true"}');
            }else{
                console.log('[Server] : Failed to create game..');
                res.send('{"result" : "false"}');
            }
        }
        
    })
}

function deleteGame(res, data){
    console.log('In delete game');
    
    var queryString = "delete from userdb.matchgame where IP=?";
    client.query(queryString, [data.ip], function(error, results){
        console.log('[Server] IP : ' + data.ip);
        if(error){
            console.log('[Server] Failed to delete game ' + error);
            res.send('{"result" : "false"}');
        }else{
            console.log(data.ip);
            if(results.affectedRows > 0){
                console.log('[Server] Delete game success!!');
                res.send('{"result" : "true"}');
            }else{
                console.log('[Server] Failed to delete game..');
                res.send('{"result" : "false"}');
            }

        }
        
    })
}

function startGame(res, data){
    console.log('In start game');
    
    var queryString = "update userdb.matchgame set CanJoin=true where IP=?";
    client.query(queryString, [data.ip], function(error, results){
        console.log('[Server] IP : ' + data.ip);
        if(error){
            console.log('[Server] Failed to start game ' + error);
            res.send('{"result" : "false"}');
        }else{
            console.log(data.ip);
            if(results.affectedRows > 0){
                res.send('{"result" : "true"}');
            }else{
                res.send('{"result" : "false"}');
            }
        }
        
    })

}

module.exports = {
    regist : regist,
    login : login,
    logout : logout,
    matchGame : matchGame,
    createGame : createGame,
    deleteGame : deleteGame,
    startGame : startGame
};