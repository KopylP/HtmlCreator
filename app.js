let express = require('express');
let path = require('path');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let url = require('url');
let clients = 0;
let rooms  = [];
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
let namespaceNames = [];
let namespaces = [];
app.get('/create', function(req, res){
	let q = url.parse(req.url, true);
	let qdata = q.query;

		let editData;
		namespaceNames.push(qdata.namespace);
		io.on('connection', function(socket){
			//
			console.log("socket was joining to the");
			socket.on("myRoomName", function(data)
			{
			//
			socket.join(data.namespace);
			socket.to(qdata.namespace).emit("newClientEvent", {Count: clients});
			clients++;
			socket.to(qdata.namespace).emit("newClientEvent", {Count: clients});

			socket.on("changeEmit", function(data)
				{
					editData = {htmlVal: data.htmlVal, cssVal: data.cssVal, jsVal: data.jsVal};
					socket.to(data.name).emit("newDataEvent", editData);
				});

			socket.on('disconnect', function()
			{
				clients--;
				console.log('user disconnected');
				socket.to(qdata.namespace).emit("newClientEvent", {Count: clients});
			});

				// if(editData)
				// {
				// 	console.log("if editData");
				// 	room.to(socket.id).emit('dataCreatedEvent', editData);
				// }
		});
		//
		});
	// }


	res.sendFile(__dirname + '/create.html');
	// UpdateInfo();
	// console.log(namespaces.length + "new");


});



http.listen(3000, function(){
	console.log('listening on *:3000 port.');
});

