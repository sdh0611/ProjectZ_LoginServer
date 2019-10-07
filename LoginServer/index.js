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
    new RuleCreater('/match', 'POST', handler.match),
    new RuleCreater('/create', 'POST', handler.create),
];


server.startServer(rule);