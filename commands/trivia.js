const { nubot } = require('../bot.js')

function execute(count) {
    setInterval(() => {
        console.log('test')
    }, 1000)
    return "test"
}

module.exports = {
    executeFunction: execute,
    invoker: '!poketrivia',
    tags: ["attack"]
}