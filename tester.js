require('app-module-path').addPath(__dirname);
const manager = require(`./cmdsetup.js`).manager;
const cfg = require('./config.js')


var args = process.argv.slice(2);
const rawMsg = args.join(' ');
const CLI_BOT_RESPONSE_COLOR = "\x1b[1m"
manager.setResultHandler((result) => {
  if (result && result.then) {
    result.then((response) => {
      console.log(`${CLI_BOT_RESPONSE_COLOR}%s\x1b[0m`, response);
      // does process.exit need to be added somewhere in the actual bot code so it can exit or is it fine since its expected to stay alive? Something with Promises being in the code makes this necessary
      process.exit();
    });
  } else if (result) {
    console.log(`${CLI_BOT_RESPONSE_COLOR}%s\x1b[0m`, result);
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
