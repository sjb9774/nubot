function execute() {
    const cmdsetup = require('../cmdsetup.js');
    const modules = cmdsetup.getFinalCommandModules();
    const invokers = modules.map((m) => m.invoker);
    return `Commands: ${invokers.sort().join(', ')}`;
}

module.exports = {
    executeFunction: execute,
    invoker: '@bigstevebot info',
    tags: ["info", "bigstevebot"]
}