const cfg = require('./nubot/config.js');

function isGod() {
    return false;
    const { getCurrentMessageContext } = require('stevebot');
    const godUsers = JSON.parse(cfg.getEnvConfig("GOD_USERS") || '[]').map((user) => user.toLowerCase());
    const ctx = getCurrentMessageContext();
    return godUsers.indexOf(ctx.username.toLowerCase()) !== -1;
}

module.exports = {
    defaultPermissions: function(nextPermissionCheck, ...rest) {
        return isGod() || nextPermissionCheck();
    },
    commandPreSetupHook: function(detectedCommandFiles) {
        const DISABLED_COMMANDS = JSON.parse(cfg.getEnvConfig("DISABLED_COMMANDS") || '[]');
        const enabledCommands = detectedCommandFiles.filter((filename) => DISABLED_COMMANDS.indexOf(filename) === -1);
        console.log(`Enabled commands: ${enabledCommands}`);
        return enabledCommands;
    }
}