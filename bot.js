const { Bot } = require('stevebot');
const setup = require('./command-setup.js')

module.exports = {
    createNubot: (say, listen) => {
        return new Bot({
            commandsDir: `${process.env.NODE_PATH}/commands/`,
            globalPermission: setup.defaultPermissions,
            commandPreSetupHook: setup.commandPreSetupHook,
            say,
            listen
        });
    }
}