require('app-module-path').addPath(__dirname);
const manager = require(`./cmdsetup.js`);
const cfg = require('./config.js')


var args = process.argv.slice(2);
const rawMsg = args.join(' ');

manager.manager.setResultHandler((result) => {
  if (result && result.then) {
    result.then((response) => {
      console.log(response);
      // does process.exit need to be added somewhere in the actual bot code so it can exit or is it fine since its expected to stay alive? Something with Promises being in the code makes this necessary
      process.exit();
    });
  } else if (result) {
    console.log(result);
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
manager.manager.onMessage(target, context, msg, self);
