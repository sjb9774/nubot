require('app-module-path').addPath(__dirname);
const tmi = require('tmi.js');
const stevebot = require('stevebot');
const cfg = require('./nubot/config.js');
const { createNubot } = require('./bot.js');
const { client } = require('./client.js');

const nubot = createNubot((x) => x, (x) => x);
const manager = nubot.getManager();

process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
  console.trace();
})

manager.setResultHandler(({result}) => {
    if (!result) {
      return;
    }
    const messageContext = nubot.getCurrentMessageContext();
    const respond = (response) => {
      console.log(`Responding to ${messageContext.username} in ${messageContext.target}`);
      client.say(messageContext.target, response);
    };

    if (result.then) {
      result.then(function(response) {
        respond(response);
      })
    } else if (result) {
      respond(result);
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