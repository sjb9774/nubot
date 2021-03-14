const commands = require('./commands.js');
require('dotenv').config();

const DISABLED_COMMANDS = JSON.parse(process.env.DISABLED_COMMANDS || '[]');

const fs = require('fs');
// every file in the "commands" folder can be automatically converted into a bot command as long as it exposes the three props
// executeFunction: Function to run when the command is called
// invoker: String or function that determines whether a message is the command in question. If a string, just a simple strict match to the first element of the message
// permission: optional, a callable that takes the same args as the executeFunction and returns a bool indicating whether a command should be executed based on separate criteria from the invoker
// tags: optional, arbitrary descriptive tags used for simple command disabling
fs.readdirSync('./commands/').forEach((file) => {
    const cmd = require(`./commands/${file}`);
    const isDisabled = cmd.tags.reduce((currentValue, tag) => {
        return currentValue || DISABLED_COMMANDS.indexOf(tag) !== -1;
    }, false);
    if (!isDisabled) {
        const permFunction = cmd.permission || commands.permissions.ALL;
        const wrappedExecute = (...args) => {
            if (permFunction(...args)) {
                return cmd.executeFunction(...args);
            }
            return "You do not have permission to execute this command";
        }
        commands.createCommand(wrappedExecute, cmd.invoker, cmd.tags);
    } else {
        console.log(`Command from ${file} disabled`);
    }
});

module.exports = {
    manager: commands.manager,
    // exporting this indirectly just to make it not necessary to require commands.js individually since it current has a bit of a singleton nature
    getCurrentMessageContext: commands.getCurrentMessageContext
}