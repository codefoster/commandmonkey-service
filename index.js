console.log('here');
var app = require('express')();

var targetSocket;

//setup the http route (for receiving commands)
app.get('/api/command', function (req, res) {
    //if there's a target, send the command via a socket message
    if (targetSocket) {
        targetSocket.emit('command', req.query.cmd);
        console.log(req.query.cmd + ' command received and sent to target device');
    }
    else {
        console.log('command received but no devices have checked in yet to receive the command (' + req.query.cmd + ')');
    }
});

pingConsole();

function pingConsole(){
    console.log('ping');
    setTimeout(pingConsole,5000);
}
//setup the sockets (for setting target)
var io = require('socket.io')(app);
io.on('connection', function (socket) {
    console.log('connection from client ' + socket.id);
    socket.on('setTarget', function () {
        console.log('Setting ' + socket.id + ' as target...');
        targetSocket = socket
    });
});

app.listen(process.env.PORT);
module.exports = app;
