const tmi = require('tmi.js');
const bst = require('./bst.json');
const express = require('express')
const jw = require('jaro-winkler');
const bothelper = require('./bothelper.js')
require('dotenv').config();

// Using this script to keep_alive.py in node
const app = express()
let runPy = new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', ['./keep_alive.py']);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
});

app.get('/', (req, res) => {

    res.write('welcome\n');

    runPy.then(function(fromRunpy) {
        console.log(fromRunpy.toString());
        res.end(fromRunpy);
    });
})

var p = 8080; //unsure if this should be a different port
app.listen(p, () => console.log(`Application listening on port ${p}!`))
console.log(process.env.CHANNEL_NAME);

// Define configuration options for the chatbot
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: JSON.parse(process.env.CHANNEL_NAME), // Using parse to access list of channels
  connection: {
    reconnect: true
  }
};


// Create a client with our options
const client = new tmi.client(opts);


// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);


// Connect to Twitch:
client.connect();



// Called every time a message comes in
// Currently checks each message for a command and then uses a series of if-statements to determine what action to take. Ugly but it works. Will eventually implement more elegantly.
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message and convert command to lowercase
  const commandName = msg.split(' ')[0].toLowerCase();
  const user = context["username"].toLowerCase()

  response = bothelper.handleCommand(commandName, msg, user);
  if (response && response.then) {
    response.then(function(result) {
      console.log(`Responding to ask from ${target}`);
      client.say(target, result);
    })
  } else if (response) {
    console.log(`Responding to ask from ${target}`);
    client.say(target, response);
  }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}