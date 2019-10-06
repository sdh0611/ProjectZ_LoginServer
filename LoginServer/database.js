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
    
    var queryString = "select * from userdb.userinfo where id=?";
    client.query(queryString, data.id, function(error, results){
        if(error){
            console.log(error);
            res.send('Query error : ' + error);
        }else{ 
            if(results.length > 0){
                res.send('ID already exist');        
            }else{
                queryString = "insert into userdb.userinfo set?";
                client.query(queryString, data, function(error, results){
                    if(error){
                        res.send('Failed to create new data : '+error);
                    }else{
                        res.send('Regist success!!');
                    }
            
                });
            }
        
        }
    });
}

function login(res, data){
    console.log('In Login');
    
    var queryString = "select * from userdb.userinfo where id=? and password=?";
    client.query(queryString, [data.id, data.password], function(error, results){
        console.log(data.id);
        if(error){
            res.send('Failed to login ' + error);
        }else{
            console.log(data.id + ", " + data.password);
            if(results.length > 0){
                var nickname = results[0].nickname;

                if(false == results[0].IsConnect){
                    console.log('Set is connect.');
                    queryString = "update userinfo set isconnect=true where id=?";
                    client.query(queryString, [data.id], function(error, results){
                        if(error){
                            res.send('{"result" : "false"}');
                        }else{
                            var sendData = {
                                result : "true",
                                id : data.id,
                                nickname : nickname
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(sendData));
                        }

                    });
                }
                else{
                    res.send('{"result" : "false"}');
                }
                
            }else{
                res.send('{"result" : "false"}');
            }
        }
        
    })

}

function logout(res, data){
    console.log('In Logout');
    
    var queryString = "update userinfo set isconnect=false where id=?";
    client.query(queryString, [data.id], function(error, results){
        console.log(data.id);
        if(error){
            res.send('Failed to logout ' + error);
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

module.exports = {
    regist : regist,
    login : login,
    logout : logout
};