angular.module('ioApp', []).controller('mainController', function(){
	var socket = io.connect();
	var $chat = $('#chat');
	var messages = [];
	this.showChat = false;

	this.join = function(name) {
		this.showChat = true;
	}

	this.messageSubmit = function(message) {
		if(message != '') {
			socket.emit('send message', message);
			this.message = '';
		}
	}

	socket.on('new message', function(data){
		$chat.append('<div class="well">' + data.msg + '</div>');
	});
});