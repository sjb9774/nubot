var bot = require("./bothelper.js");
require('dotenv').config();

var args = process.argv.slice(2);
const rawMsg = args[0];

const commandName = rawMsg.split(' ')[0].toLowerCase();
console.log(`command: ${commandName}`);
const user = "CLI_USER";

var result = bot.handleCommand(commandName, rawMsg, user);

// apparently the only standard as to whether or not something is a Promise
// is "does it have a .then method?"
if (result.then) {
  result.then((response) => {
    console.log(response);
    // does process.exit need to be added somewhere in the actual bot code so it can exit or is it fine since its expected to stay alive? Something with Promises being in the code makes this necessary
    process.exit();
  });
} else {
  console.log(result);
}