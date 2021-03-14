require('dotenv').config();
const manager = require('./cmdsetup.js');



process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', "TEST");
});

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
  target: process.env.CLI_CHANNEL || "CLI",
  context: {
    "user-type": process.env.CLI_USER_TYPE || "user",
    "username": process.env.CLI_USER || "CLI_USER"
  },
  msg: rawMsg,
  self: false
}
const {target, context, msg, self} = mockParams;
manager.manager.onMessage(target, context, msg, self);
