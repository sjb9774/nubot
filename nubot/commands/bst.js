const bst = require('../../bst.json');

function capitalize(str) {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function execute(pokemon) {
    if (!pokemon || !pokemon.trim()) {
      return "Please include a pokemon name";
    }

    if (pokemon.toLowerCase().includes("numot", "kenji")) {
        return "0 LUL";
    }

    if (!bst[pokemon]) {
      return `No stats found for "${pokemon}"`;
    }
    return `${capitalize(pokemon)} base stat total: ${bst[pokemon]}`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!bst',
    tags: ["bst"]
}