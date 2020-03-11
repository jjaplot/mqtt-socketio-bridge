// mqtt-socketio-bridge
//
// (c) Copyright 2018 MCQN Ltd
//

var mqtt = require('mqtt')
var express = require('express')
var app = express()
var router = express.Router()
var path = __dirname + '/static_files/'
var http = require('http').Server(app)
var io = require('socket.io')(http)
var pressure


// gauge setup

var opts = {
angle: 0, // The span of the gauge arc
lineWidth: 0.2, // The line thickness
radiusScale: 0.89, // Relative radius
pointer: {
length: 0.54, // // Relative to gauge radius
strokeWidth: 0.053, // The thickness
color: '#000000' // Fill color
},
limitMax: false,     // If false, max value increases automatically if value > maxValue
limitMin: false,     // If true, the min value of the gauge will be fixed
colorStart: '#6FADCF',   // Colors
colorStop: '#8FC0DA',    // just experiment with them
strokeColor: '#E0E0E0',  // to see which ones work best for you
generateGradient: true,
highDpiSupport: true,     // High resolution support
staticZones: [
{strokeStyle: "#00FF00", min: 0, max: 60}, // Red from 100 to 60
{strokeStyle: "#0000FF", min: 60, max: 150}, // Yellow
{strokeStyle: "#00FFFF", min: 150, max: 220}, // Green
{strokeStyle: "#FFDD00", min: 220, max: 260}, // Yellow
{strokeStyle: "#FF0000", min: 260, max: 300}  // Red
],
};
var target = document.getElementById('foo'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 300; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 50; // set animation speed (32 is default value)

function updateGauge(valueP){
        gauge.set(valueP); // set actual value
}

// Port that the web server should listen on
var port = process.env.PORT || 3000;

// Enter details of the MQTT broker that you want to interface to
// By default we'll use the public HiveMQ one, so any Arduino clients using
// the PubSubClient library can easily talk to it
var MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://broker.mqtt-dashboard.com"

// We need to cope with wildcards in topics, so can't just do a simple comparison
// This function returns true if they match and false otherwise
// topic1 can include wildcards, topic2 can't
var topicMatch = function(topic1, topic2) {
        // Switch our wildcards from MQTT style to Regexp style
        var matchStr = topic1.replace(/#/g, ".*")
        return (topic2.match("^"+matchStr+"$") != null)
}


var client = mqtt.connect(MQTT_BROKER)
client.on('connect', function() {
        console.log("Connected to "+MQTT_BROKER);
})

client.on('message', function(topic, payload) {
        console.log("topic: "+topic)
        console.log("payload: "+payload)
        pressure = payload
        // Send it to any interested sockets
        Object.keys(io.sockets.adapter.rooms).map(function(room_name) {
                // See if this room matches the topic
                if (topicMatch(room_name, topic)) {
                        // It does.  Send the message
                        for (var clientId in io.sockets.adapter.rooms[room_name].sockets) {
                                io.sockets.connected[clientId].emit('mqtt', { 'topic': topic, 'payload': payload.toString() })
                                updateGauge(parseInt(payload.toString()))
                        }
                }
        })
})

io.sockets.on('connection', function(sock) {
        // New connection, listen for...
        console.log("New connection from "+sock.id)

        // ...subscribe messages
        sock.on('subscribe', function(msg) {
                console.log("Asked to subscribe to "+msg.topic)
                if (msg.topic !== undefined) {
                        sock.join(msg.topic)
                        if (io.sockets.adapter.rooms[msg.topic].length == 1) {
                                // We're the first one in the room, subscribe to the MQTT topic
                                client.subscribe(msg.topic)
                        }
                        // else someone is already here, so we'll have an MQTT subscription already
                }
                // FIXME else It'd be nice to report the error back to the user
        })

        // ...publish messages
        sock.on('publish', function(msg) {
                console.log("socket published ["+msg.topic+"] >>"+msg.payload+"<<")
                client.publish(msg.topic, msg.payload)
        })

        // ...and disconnections
        sock.on('disconnect', function(reason) {
                console.log("disconnect from "+sock.id)
                // The socket will have left all its rooms now, so see if there
                // are any empty ones
                for (var sub in client._resubscribeTopics) {
                        if (io.sockets.adapter.rooms[sub] == undefined) {
                                // There's no "room" for this subscription, so no clients
                                // are watching it, so we should unsubscribe
                                console.log("Unsubscribing from "+sub)
                                client.unsubscribe(sub)
                        }
                        // else someone is watching, so leave this MQTT subscription in place
                }
        })

})


// Serve static files from the 'static_files' folder
app.use(express.static('static_files'))


router.use(function (req,res,next) {
  console.log("/" + req.method)
  next()
})




// Set up web server to serve 
app.get('/', function(req, res) {
        res.sendFile(__dirname+"/static_files/mqtt-socket.html")
})

app.get("/about",function(req,res){
  res.sendFile(__dirname+"/static_files/about.html")
})

app.get("/test",function(req,res){
  res.sendFile(__dirname+"/static_files/test.html")
})

app.post('/clicked',function(req,res){
  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
        
  json_data = json.dumps({'time': 100, 'value': 100})
        res.write(json_data)
})

app.post('/chart-data',function(req,res){
  res.status(200).set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
        
  json_data = json.dumps({'time': 100, 'value': 100})
        res.write(json_data)
})

app.get('/countdown', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  //countdown(res, 100)
  mqcallbal(res)
})

function countdown(res, count) {
  res.write("data: " + count + "\n\n")
  if (count)
    setTimeout(() => countdown(res, count-1), 1000)
  else
    res.end()
}

function mqcallbal(res){
        res.write("data: " + pressure + "\n\n")
 
}

http.listen(port, function() {
        console.log("listening on "+port)
})
