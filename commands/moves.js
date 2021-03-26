const Pokedex = require('pokedex-promise-v2');
const genhelper = require('nubot/gen/gencommandhelper.js');
const utils = require('nubot/utils.js');


function getPokemonMoveLevelList(pokemonName, allowedVersionGroups) {
    var dex = new Pokedex();
    var pokedata = dex.getPokemonByName(pokemonName).then(function(response) {
      var levels = response.moves.map(function (move) {
        return move.version_group_details.map(function (details) {
          if (allowedVersionGroups.indexOf(details.version_group.name) !== -1) {
            return details.level_learned_at;
          }
        });
      });
      const uniqueNonNullLevels = new Set(levels.flat().filter(x => x).sort((a, b) => a - b));
      return uniqueNonNullLevels;
    });
    return pokedata;
  }
  
  function getPokemonMoves(pokemonName, genFilter) {
    var dex = new Pokedex();
    // transform so it's understood by the API appropriately
    var pokemonName = pokemonName.replace('.', '').replace(' ', '-');
    // if a specific game is specified ("ruby") then we just find the version group associated
    // with that game and that is what we use to filter down the move-level-list
    return dex.getVersionByName(`${genFilter}`).then(function(response) {
      var allowedVersionGroups = [response.version_group.name];
      return getPokemonMoveLevelList(pokemonName, allowedVersionGroups);
    });
  }


function execute(pokemon, genFilter) {
    var pokemon = pokemon.toLowerCase();
    if (!pokemon) {
        return 'Usage: To get the levels at which Bulbasaur learns moves in Fire Red: "!moves Bulbasaur +firered"'
    }
    if (!genFilter) {
      return "Must provide generation filter or set one separately ('!setgen firered' or '!moves bulbasaur +leafgreen'";
    }
    return getPokemonMoves(pokemon, genFilter).then((data) => {
        const moveLevelList = [...data];
        if (moveLevelList.length === 0) {
        return `${utils.capitalize(pokemon)} learns no moves in game "${genFilter}"`;
        }
        const moves = moveLevelList.join(', ');
        return `(Gen "${genFilter}") ${utils.capitalize(pokemon)} learns moves at the following levels: ${moves}`;
    }).catch(function(err) {
        console.log(err);
        return `No pokemon found by name ${utils.capitalize(pokemon)} in game "${genFilter}"`;
    });
}

module.exports = {
    executeFunction: execute,
    invoker: '!moves',
    tags: ["moves"],
    argResolver: genhelper.pokemonAndGenFilterParse
}