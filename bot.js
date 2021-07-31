const { Bot } = require('stevebot');
const setup = require('./command-setup.js')

const Nubot = new Bot({
    commandsDir: `${process.env.NODE_PATH}/commands`,
    globalPermission: setup.defaultPermissions,
    commandPreSetupHook: setup.commandPreSetupHookd
});

module.exports = {
    nubot: Nubot
}