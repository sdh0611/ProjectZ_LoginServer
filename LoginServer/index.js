var server = require('./server');
var handler = require('./requestHandler');
var database = require('./database')

handler.connectDB(database);

function RuleCreater(path, method, callback){
    this.path = path;
    this.method = method;
    this.function = callback;
}

var rule = [
    new RuleCreater('/', 'GET', handler.start),
    new RuleCreater('/regist', 'GET', handler.showRegistForm),
    new RuleCreater('/login', 'GET', handler.showLoginForm),

    new RuleCreater('/regist', 'POST', handler.regist),
    new RuleCreater('/login', 'POST', handler.login),
    new RuleCreater('/logout', 'POST', handler.logout),
    new RuleCreater('/match_game', 'POST', handler.matchGame),
    new RuleCreater('/create_game', 'POST', handler.createGame),
    new RuleCreater('/delete_game', 'POST', handler.deleteGame),
    new RuleCreater('/start_game', 'POST', handler.startGame),
];


server.startServer(rule);