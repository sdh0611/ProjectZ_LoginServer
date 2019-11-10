var AWS = require('aws-sdk');
AWS.config.update({
    // accessKeyId : "test",
    // secretAccessKey : "test1",
    region : "ap-northeast-2"
});

/*
    endpoint값은 로컬 테스트용.
*/
var gameLift = new AWS.GameLift({endpoint : "http://127.0.0.1:9080"});
// var gameLift = new AWS.GameLift({endpoint : "https://gamelift.ap-northeast-2.amazonaws.com"});

var gameLiftAliasID = 'a';
var gameLiftFleetID = 'fleet-123';


function createGameSession(req, res){

    var params = {
        MaximumPlayerSessionCount : req.body.maxPlayer,
        // AliasID : gameLiftAliasID,
        FleetId : gameLiftFleetID,
        CreatorId : req.body.creatorID,
        Name : req.body.sessionName        
    }

    gameLift.createGameSession(params, function(err, data){

        if(err){
            console.log('[Server] Create game session error : ' + err);
            res.send('{"result" : "false"}');
        }else{
            var sendData = {
                result : "true",
                test : 1,
                sessionID : data.GameSessionId
            };
            console.log('[Server] Create game session response data : ' + sendData.sessionID);
            res.send(sendData);
        }

    });


}

function describeGameSession(req, res){
    
    var params = {
        SessionID : req.body.sessionID
    };

    gameLift.describeGameSessionDetails(params, function(err, data){

        if(err){
            console.log('[Server] Describe game session error : ' + err);
            res.send('{"result" : "false"}');
        }else{
            var sendData = {
                result : "true",
                sessionID : data.GameSessionId,
                status : data.Status
            };
            console.log('[Server] Describe game session response data : ' + sendData);
            res.send(sendData);
            // res.setHeader('Content-Type', 'application/json');
            // res.end(JSON.stringify(sendData));
        }

    });

}

function createPlayerSession(req, res){

    var params = {
        SessionID : req.body.sessionID,
        PlayerID : req.body.playerID
    };

    gameLift.createPlayerSession(params, function(err, data){

        if(err){
            console.log('[Server] Create player session error : ' + err);
            res.send('{"result" : "false"}');
        }else{
            var sendData = {
                result : "true",
                status : data.Status,
                playerSessionID : data.PlayerSessionId,
                ipAddress : data.IpAddress,
                port : data.Port
            };
            console.log('[Server] Create player session response data : ' + sendData);
            res.send(sendData);

            // res.setHeader('Content-Type', 'application/json');
            // res.end(JSON.stringify(sendData));
        }

    });

}

function searchGameSessions(req, res){

    console.log('In search game.');
    var params = {
        // AliasID : gameLiftAliasID,
        FleetId : gameLiftFleetID,
        FilterExpression : req.body.filterExpression,
        Limit : req.body.number,
        SortExpression : req.body.sortExpression
    };

    gameLift.searchGameSessions(params, function(err, data){
    console.log('In search game2.');
    if(err){
            console.log('[Server] Search game sessions error : ' + err);
            res.send('{"result" : "false"}');
        }else{
            var sendData = {
                result : "true",
                size : data.GameSessions.length,
                gameSessions : data.GameSessions
            };
            console.log('[Server] Search game sessions response data : ' + sendData);
            res.send(sendData);
            // res.setHeader('Content-Type', 'application/json');
            // res.end(JSON.stringify(sendData));
        }

    });


}

module.exports = {
    createGameSession : createGameSession,
    describeGameSession : describeGameSession,
    createPlayerSession : createPlayerSession,
    searchGameSessions : searchGameSessions 
}