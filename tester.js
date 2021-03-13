require('dotenv').config();
const manager = require('./cmdsetup.js');



process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', "TEST");
});

var args = process.argv.slice(2);
const rawMsg = args.join(' ');

const commandName = rawMsg.split(' ')[0].toLowerCase();
console.log(`command: ${commandName}`);
const user = "CLI_USER";

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
manager.manager.consume(rawMsg);
