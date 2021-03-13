const commands = require('./commands.js');

const fs = require('fs');
// every file in the "commands" folder can be automatically converted into a bot command as long as it exposes the three props
// executeFunction: Function to run when the command is called
// invoker: String or function that determines whether a message is the command in question. If a string, just a simple strict match to the first element of the message
// tags: arbitrary descriptive tags to be used in the future potentially
fs.readdirSync('./commands/').forEach((file) => {
    const cmd = require(`./commands/${file}`);
    commands.createCommand(cmd.executeFunction, cmd.invoker, cmd.tags);
});

module.exports = {
    manager: commands.manager,
    // exporting this indirectly just to make it not necessary to require commands.js individually since it current has a bit of a singleton nature
    getCurrentMessageContext: commands.getCurrentMessageContext
}