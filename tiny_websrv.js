/* 
 *
 *
 * simple sample
 *
 * node.js web server
 *
 * by gbox3d, http://cafe.naver.com/goorume
 *
 */

var gVersionString = "tinny webserver v0.3"

var fs = require('fs');
var http = require('http');

var server = http.createServer(function(request, response) {
    var url = request.url;
    var file_ext = url.slice(url.lastIndexOf('.'), url.length);

    url = '.' + url;

    if (url == './') {
        fs.readFile('index.html', function(error, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        });
    }
    else {
        switch (file_ext) {
            case '.html':
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(data);
                });
                break;
            case '.js' :
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'text/javascript'});
                    response.end(data);
                });
                break;
            case '.css' :
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'text/css'});
                    response.end(data);
                });
                break;
            case '.jpg' :
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'image/jpeg'});
                    response.end(data);
                });
                break;
            case '.png' :
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'image/png'});
                    response.end(data);
                });
                break;
            case '.gif' :
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'image/gif'});
                    response.end(data);
                });
                break;
            default :
                fs.readFile(url, function(error, data) {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(data);
                });
                break;

        }

    }
});


var gPort = 8080;

server.on('connection',function(param) {
    console.log('connection :' + param.server._connections);
});

server.listen(gPort);


console.log('start ' + gVersionString +' : ' + gPort);