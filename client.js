require('app-module-path').addPath(__dirname);
const tmi = require('tmi.js');
const cfg = require('./nubot/config.js');

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

module.exports = {
    client
}