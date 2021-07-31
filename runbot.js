require('app-module-path').addPath(__dirname);
const tmi = require('tmi.js');
const stevebot = require('stevebot');
const cfg = require('./nubot/config.js');

const manager = stevebot.manager;
const commands = stevebot.commands;

process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
  console.trace();
})

const channels = JSON.parse(cfg.getEnvConfig("CHANNEL_NAME") || '[]');

if (channels.length === 0) {
  console.log("WARNING: No channels configured with CHANNEL_NAME env variable");
} else {
  console.log(`Connecting to channels: ${channels.join(", ")}`);
}

console.log(`Bot username: ${cfg.getEnvConfig("BOT_USERNAME")}`);
console.log(cfg.getEnvConfig("OAUTH_TOKEN") ? "Oauth token defined" : "WARNING: Oauth token not defined");

// Define configuration options for the chatbot
const opts = {
  identity: {
    username: cfg.getEnvConfig("BOT_USERNAME"),
    password: cfg.getEnvConfig("OAUTH_TOKEN")
  },
  channels: channels, // Using parse to access list of channels
  connection: {
    reconnect: true
  }
};


// Create a client with our options
const client = new tmi.client(opts);

manager.setResultHandler((response) => {
    if (!response) {
      return;
    }
    const messageContext = commands.getCurrentMessageContext();
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
client.on('message', manager.onMessage.bind(manager));
client.on('connected', onConnectedHandler);
// Connect to Twitch:
client.connect().catch(console.error);


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}