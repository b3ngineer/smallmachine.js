var restify = require('restify');

/* create the restify server */
var server = restify.createServer({
});

server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.bodyParser());

server.post('/test/', function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Origin', '*');
    res.send(200, JSON.stringify(req.params));
    //console.log(req.params.blob.ar[2].a)
    res.end();
    return next();
});

var port = 12345;
server.listen(port);
console.log('Server listening on port ' + port)
