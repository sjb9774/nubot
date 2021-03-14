const dex = require('../pokedex.js');
const genhelper = require('./../gen/gencommandhelper.js');
const Pokedex = require('pokedex-promise-v2');


function capitalize(str) {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function execute(pokemon, genFilter) {
  var dex = new Pokedex();
  return dex.getPokemonByName(pokemon.toLowerCase()).then((response) => {
    // does this pokemon even exist in our specified gen? if not, just assume we want the most recent typing
    const existsInGen = response.game_indices.reduce((currentValue, gi) => {
      return currentValue || gi.version.name === genFilter;
    }, false);
    if (existsInGen && response.past_types && response.past_types.length > 0) {
      let genTypes;
      response.past_types.forEach((past_type_info) => {
        if (genhelper.isGenFilterBeforeGen(genFilter, past_type_info.generation.name)) {
          genTypes = past_type_info.types.map((past_type) => past_type.type.name);
        }
      });
      return genTypes;
    }
    
    return response.types.map((typeData) => typeData.type.name);
  }).then((types) => {
    const stringTypes = types.map((t) => capitalize(t)).join(" and ");
    return `${capitalize(pokemon)} is ${stringTypes}`;
  });
}

module.exports = {
    executeFunction: execute,
    invoker: '!types',
    tags: ["types"],
    argResolver: genhelper.pokemonAndGenFilterParse
}