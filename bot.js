const tmi = require('tmi.js');
const bst = require('./bst.json');
const manager = require('./cmdsetup.js');
require('dotenv').config();

process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
  console.trace();
})

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

manager.manager.setResultHandler((response) => {
    if (!response) {
      return;
    }
    const messageContext = manager.getCurrentMessageContext();
    const respond = (result) => {
      console.log(`Responding to ${messageContext.username} in ${messageContext.target}`);
      client.say(messageContext.target, result);
    };

    if (response.then) {
      response.then(function(result) {
        respond(result);
      })
    } else if (response) {
      respond(response);
    }
});

// Register our event handlers (defined below)
client.on('message', manager.manager.onMessage.bind(manager.manager));
client.on('connected', onConnectedHandler);
// Connect to Twitch:
client.connect().catch(console.error);


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}