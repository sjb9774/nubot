const genstate = require('nubot/gen/genstate.js');

function execute() {
    const { getCurrentMessageContext } = require('stevebot');
    const msgCtx = getCurrentMessageContext();
    const gen = genstate.get(msgCtx.channel);
    if (gen) {
        return `Generation is currently set to "${gen}"`;
    }
    return `Generation not yet set for this channel`;
    
}

module.exports = {
    executeFunction: execute,
    invoker: '!getgen',
    tags: ["getgen", "gen"]
}