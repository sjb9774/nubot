const genstate = require('../gen/genstate.js');
const cmd = require('./../commands.js');

function execute() {
    const msgCtx = cmd.getCurrentMessageContext();
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