const bst = require('../bst.json');

function capitalize(str) {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function execute(pokemon) {
    return `${capitalize(pokemon)} base stat total: ${bst[pokemon]}`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!bst',
    tags: ["bst"]
}