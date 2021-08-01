const genstate = require('nubot/gen/genstate.js');
const permissions = require('stevebot').permissions;

function execute(generation, {getCurrentMessageContext}) {
    const msgCtx = getCurrentMessageContext();
    let didSet = genstate.set(msgCtx.channel, generation);
    if (didSet) {
        return `Set generation to "${generation}"`;
    }
    return `Not a valid generation`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!setgen',
    permission: () => permissions.MOD,
    tags: ["setgen", "gen"]
}