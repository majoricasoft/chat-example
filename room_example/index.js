var app = require('express')();
var http = require('http').createServer(app);

var io = require('socket.io')(http);

io.on('connection', (socket) => {
  
  console.log('client connected: '+ socket.id)

  socket.emit('authenticate', {
    auth: true
  });

  socket.on('rooms', (data) => {
    for (let i=0;i<data.rooms.length;i++) {
      let room = data.rooms[i].name;

      socket.join( room )

      console.log(socket.id, 'joined room', room )
    }
  })

  socket.on('disconnect', function(){ 
      console.log('client disconnect: ' + socket.id)
  });
  
});

app.get('/private/:room', (req, res) => {

  let room = req.params.room;

  io.sockets.in( room ).emit('private_message', {
    message: 'joined room ' + room
  })

  res.send('stop');
})



http.listen( port = 80, () => {
    console.log(`Server listening on port ${port}`);
})