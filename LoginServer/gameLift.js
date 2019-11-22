var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId : "",
    secretAccessKey : "",
    region : "ap-northeast-2"
});

/*
    endpoint값은 로컬 테스트용.
*/
// var gameLift = new AWS.GameLift({endpoint : "http://127.0.0.1:9080"});
var gameLift = new AWS.GameLift({endpoint : "https://gamelift.ap-northeast-2.amazonaws.com"});

var gameLiftAliasID = '';
var gameLiftFleetID = 'fleet-123';


function createGameSession(req, res){

    var params = {
        MaximumPlayerSessionCount : req.body.maxPlayer,
        AliasId : gameLiftAliasID,
        // FleetId : gameLiftFleetID,
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
                sessionID : data.GameSession.GameSessionId
            };
            console.log('[Server] Create game session response data : ' + sendData.sessionID);
            res.send(sendData);
        }

    });


}

function describeGameSession(req, res){
    
    var params = {
        GameSessionId : req.body.sessionID
    };

    gameLift.describeGameSessions(params, function(err, data){

        if(err){
            console.log('[Server] Describe game session error : ' + err);
            res.send('{"result" : "false"}');
        }else{
            var sendData = {
                result : "true",
                sessionID : data.GameSessions[0].GameSessionId,
                status : data.GameSessions[0].Status
            };
            console.log('[Server] Describe game session response data : ' + sendData.sessionID);
            res.send(sendData);
        }

    });

}

function createPlayerSession(req, res){

    var params = {
        GameSessionId : req.body.sessionID,
        PlayerId : req.body.playerID
    };

    console.log(params.PlayerId);

    gameLift.createPlayerSession(params, function(err, data){

        if(err){
            console.log('[Server] Create player session error : ' + err);
            res.send('{"result" : "false"}');
        }else{
            var sendData = {
                result : "true",
                status : data.PlayerSession.Status,
                playerSessionID : data.PlayerSession.PlayerSessionId,
                ipAddress : data.PlayerSession.IpAddress,
                port : data.PlayerSession.Port
            };

            console.log('[Server] Create player session response data : ' + sendData);
            res.send(sendData);
        }

    });

}

function searchGameSessions(req, res){

    console.log('In search game.');
    var params = {
        AliasId : gameLiftAliasID,
        // FleetId : gameLiftFleetID,
        FilterExpression : req.body.filterExpression,
        Limit : req.body.number,
        SortExpression : req.body.sortExpression
    };

    gameLift.searchGameSessions(params, function(err, data){
        console.log('In search game2.');
        
        var sendData = {
            Result : "false",
            SessionInfos : []
        };

        if(err){
            console.log('[Server] Search game sessions error : ' + err);
        }else{
            sendData.Result = "true";
            
            // Data 가공
            data.GameSessions.forEach(function(item){
                if(item.PlayerSessionCreationPolicy != 'DENY_ALL'){                
                    sendData.SessionInfos.push({
                        SessionID : item.GameSessionId, 
                        SessionName : item.Name,
                        MaxConnection : item.MaximumPlayerSessionCount,
                        CurrentConnection : item.CurrentPlayerSessionCount
                    });
                }
            });

            console.log('[Server] Search game sessions response data : ' + sendData.SessionInfos.length);
        }
        
        res.send(sendData);
    });


}



module.exports = {
    createGameSession : createGameSession,
    describeGameSession : describeGameSession,
    createPlayerSession : createPlayerSession,
    searchGameSessions : searchGameSessions 
}