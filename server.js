var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running ...');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	//Disconnect
	socket.on('disconnect', function(data){
		for(var i=0; i<users.length; i++) {
			if(users[i].id == socket.id) {
				users.splice(i, 1);
				io.sockets.emit('get users', users);
			}
		}
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	//Send Message
	socket.on('send message', function(data){
		console.log(data);
		console.log(users);
		for(var j=0; j<users.length; j++) {
			if(users[j].user == data.person) {
				color = users[j].color;
			}
		}
		io.sockets.emit('new message', {data: data, color: color});
	});

	//Add User
	socket.on('add user', function(user) {
		/*var check = true;
		for(var k=0; k<users.length; k++) {
			if(users[k].user == user){
				check = false;
			}
		}*/
		
		/*if(check == true) {*/
			var color = getRandomColor();
			var newUser = {id: socket.id, user : user, color: color}
			users.push(newUser);
			io.sockets.emit('user color', color);
			io.sockets.emit('get users', users);
			io.sockets.emit('already user', {status:true, user: user});
		/*} else {
			io.sockets.emit('already user', {status:false, user: user});
		}*/
	});

	function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}	
});	