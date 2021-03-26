function execute() {
    const { getFinalCommandModules } = require('stevebot');
    const modules = getFinalCommandModules();
    const invokers = modules.map((m) => m.invoker);
    return `Commands: ${invokers.sort().join(', ')}`;
}

module.exports = {
    executeFunction: execute,
    invoker: '@bigstevebot info',
    tags: ["info", "bigstevebot"]
}