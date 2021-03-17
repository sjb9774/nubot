const commands = require(`commands.js`);
const cfg = require('./config.js')

const DISABLED_COMMANDS = JSON.parse(cfg.getEnvConfig("DISABLED_COMMANDS") || '[]');

function isGod() {
    const godUsers = JSON.parse(cfg.getEnvConfig("GOD_USERS" || '[]')).map((user) => user.toLowerCase());
    const ctx = commands.getCurrentMessageContext();
    return godUsers.indexOf(ctx.username.toLowerCase()) !== -1;
}
const fs = require('fs');
// every file in the "commands" folder can be automatically converted into a bot command as long as it exposes the three props
// executeFunction: Function to run when the command is called
// invoker: String or function that determines whether a message is the command in question. If a string, just a simple strict match to the first element of the message
// permission: optional, a callable that takes the same args as the executeFunction and returns a bool indicating whether a command should be executed based on separate criteria from the invoker
// tags: optional, arbitrary descriptive tags used for simple command disabling
fs.readdirSync(`${__dirname}/commands/`).forEach((file) => {
    const cmd = require(`${__dirname}/commands/${file}`);
    const isDisabled = cmd.tags.reduce((currentValue, tag) => {
        return currentValue || DISABLED_COMMANDS.indexOf(tag) !== -1;
    }, false);
    if (!isDisabled) {
        const permFunction = cmd.permission || commands.permissions.ALL;
        const defaultResolver = (...x) => x;
        const argResolver = cmd.argResolver || defaultResolver;
        const wrappedExecute = (...args) => {
            args = argResolver(...args);
            if (isGod()) { console.log("Executing as god user"); }
            if (isGod() || permFunction(...args)) {
                let result = cmd.executeFunction(...args);
                if (result && isGod) {
                    return `TheIlluminati ${result}`;
                } 
                return result;
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