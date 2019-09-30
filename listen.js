
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http, { origins: "*:*" }); /** cors origins */

http.listen(81, function() {
  console.log("app listening on port 8081!");
});

const redis = require("redis");
const client = redis.createClient({
  host: "165.22.247.225",
  port: "6379",
  password: "2GHH(G@*F7vg-.Un"
});

client.subscribe("live_message");
client.subscribe("new_room");
client.on("error", err => console.log(err));

client.on("message", function(channel, msg) {

  console.log(channel, msg);

  if (channel == "live_message") {
    let json = JSON.parse(msg);

    if (json.room == null) {
      io.emit(channel, json);
    } else {
      io.to(json.room).emit(channel, json);
    }
  }

  if ( channel == "new_room" ) {
    let json = JSON.parse(msg)
    io.emit(channel, json);
  }

});

io.on("connection", socket => {
  console.log("client connected:", socket.id);

  socket.emit("authenticate", {
    auth: true
  });

  socket.on("rooms", data => {
    console.log('rooms', data);

    for (let i = 0; i < data.length; i++) {
      let room = data[i];

      socket.join(room);

      console.log(socket.id, "joined room", room);
    }
  });

  socket.on("disconnect", function() {
    console.log("client disconnect: " + socket.id);
  });
});
