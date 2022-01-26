const bst = require('../bst.json');
const Fuse = require('fuse.js');

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

    const availablePokes = Object.keys(bst);
    const results = new Fuse(availablePokes, {includeScore: true}).search(pokemon);
    if (results.length) {
      console.log(`bst for ${pokemon} reported as ${results[0].item} with score ${results[0].score}`);
      pokemon = results[0].item;
      if (pokemon) {
        return `${capitalize(pokemon)} base stat total: ${bst[pokemon]}`;
      }
    }
    return `No stats found for "${pokemon}"`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!bst',
    tags: ["bst"]
}