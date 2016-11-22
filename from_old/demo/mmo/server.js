/**
 * Created by gbox3d on 2014. 6. 17..
 *
 *
 * 초미니 mmo rpg 서버

 module_path=/usr/local/lib/node_modules/

 npm install sockjs

 */

var theApp = {
    version : '0.0.1',
    module_path : '',
    socket : {
        port : 8080,
        connections : []
    }

};
//command line argument parse
process.argv.forEach(function(val, index, array) {

    if(val.indexOf('=') > 0) {
        var tokens = val.split('=');

        switch (tokens[0]) {
            case 'port':
                theApp.socket.port = parseInt(tokens[1]);
                break;
            case 'module_path':
                theApp.module_path = tokens[1];
                break;
        }
    }
});


var sockjs = require(theApp.module_path +  'sockjs');
var UrlParser = require('url');
var fs = require('fs');
var http = require('http');

function http_handler(req, res) {
    var result = UrlParser.parse(req.url, true);

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '1000'
    });

    switch (result.pathname) {

        default :
            (function() {
                res.write( JSON.stringify({title:"pig2d mmo server demo",version:theApp.version}));
            })();
            res.end();
            break;

    }
}

var server = http.createServer(http_handler);

var sockjsObj = sockjs.createServer();

//전체 전달
function broadCast(data,exculde_id) {

    var socket = theApp.socket;

    console.log('broadcast start');
    for(var id in socket.connections) {
        //console.log(id);

        if(id != exculde_id) {
            socket.connections[id].conObj.write(data);
        }
    }
    console.log('broadcast end');

}

sockjsObj.on('connection', function(conn) {


    var socket = theApp.socket;

    //접속자 추가
    console.log('[+] connection add :' + conn.id);
    socket.connections[conn.id] = {
        user : {
            id : '',
            name : '',
            x : 100,
            y : 100
        },
        conObj : conn
    };

    //접속환영메씨지 보내기
    conn.write('{"msg" : "welcome!"}');

    broadCast(JSON.stringify({
        msg : 'join',
        id : conn.id,
        user : socket.connections[conn.id].user
    }));

    (function () {

        var evt = {};
        evt.conn = socket.connections[conn.id];
        var id = conn.id;

        conn.on('data',
            function(message) {
                var msg = JSON.parse(message);

                if (msg.msg == 'req-user-info') {

                    var users = [];
                    for (var key in socket.connections) {

                        var conn = socket.connections[key];

                        if(conn.conObj.id != id) {
                            users.push({
                                id: conn.conObj.id,
                                x: conn.user.x,
                                y: conn.user.y

                            });
                        }
                    }

                    socket.connections[id].conObj.write(JSON.stringify({
                        msg: 'user-info',
                        users: users
                    }));

                }
                else if (msg.msg == 'move') {

                    msg.id = id;

                    socket.connections[id].user.x = msg.x;
                    socket.connections[id].user.y = msg.y;
                    console.log(msg);

                    broadCast(JSON.stringify(msg));
                }
            }
        );


        conn.on('close', function() {

            broadCast(JSON.stringify({
                msg : 'disconnect',
                id : conn.id
            }));

            delete socket.connections[conn.id];
            console.log('[-] connection closed :' + conn.id);

        });

    })();

});

sockjsObj.installHandlers(server, {
    prefix:'/mmo',
    headers : {
        'Access-Control-Allow-Origin': '*'
    }
});

server.listen(theApp.socket.port);
console.log('server running at ' + theApp.socket.port);
