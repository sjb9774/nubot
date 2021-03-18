const genstate = require('../gen/genstate.js');
const cmd = require('./../commands.js');

function execute(generation) {
    const msgCtx = cmd.getCurrentMessageContext();
    let didSet = genstate.set(msgCtx.channel, generation);
    if (didSet) {
        return `Set generation to "${generation}"`;
    }
    return `Not a valid generation`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!setgen',
    permission: cmd.permissions.MOD,
    tags: ["setgen", "gen"]
}