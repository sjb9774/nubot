const dex = require('../pokedex.js');

function capitalize(str) {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function execute(pokemon) {
  const stringTypes = dex.BattlePokedex[pokemon.toLowerCase()]['types'].join(" and ");
  return `${capitalize(pokemon)} is ${stringTypes}`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!types',
    tags: ["types"]
}