const redis = require("redis");
const client = redis.createClient({
  host: "165.22.247.225",
  port: "6379",
  password: "2GHH(G@*F7vg-.Un"
});

let json_message = {
  room: 1,
  user_id: '11',
  read_count: 0,
  message: "Hello guy"
}

client.publish('live_message', JSON.stringify(json_message), function(){
  process.exit(0);
});
