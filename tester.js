require('app-module-path').addPath(__dirname);
const {createNubot} = require('./bot.js');
const nubot = createNubot((message) => {
  console.log(`${CLI_BOT_RESPONSE_COLOR}%s\x1b[0m`, message);
}, (x) => x)
const manager = nubot.getManager();
const cfg = require('./nubot/config.js')


var args = process.argv.slice(2);
const rawMsg = args.join(' ');
const CLI_BOT_RESPONSE_COLOR = "\x1b[1m"
manager.setResultHandler(({result, commandMessage, say}) => {
  if (result && result.then) {
    result.then((response) => {
      say(response);
      // does process.exit need to be added somewhere in the actual bot code so it can exit or is it fine since its expected to stay alive? Something with Promises being in the code makes this necessary
      process.exit();
    });
  } else if (result) {
    say(result);
  }
});


mockParams = {
  target: cfg.getEnvConfig("CLI_CHANNEL") || "#CLI",
  context: {
    "user-type": cfg.getEnvConfig("CLI_USER_TYPE") || "user",
    "username": cfg.getEnvConfig("CLI_USER") || "CLI"
  },
  msg: rawMsg,
  self: false
}
const {target, context, msg, self} = mockParams;
manager.onMessage(target, context, msg, self);
