const Pokedex = require('pokedex-promise-v2');
const genstate = require('../gen/genstate.js');
const cmd = require('./../commands.js');

function romanize (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

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
    // was a numeric gen specified?
    if (Number.isInteger(parseInt(genFilter))) {
      // convert gen # to lowercase Roman numerals since that's what the API uses
      var numeralString = romanize(genFilter).toLowerCase();
  
      return dex.getGenerationByName(`generation-${numeralString}`).then(function (response) {
        // version groups are the logical groupings of games that make up the generation
        // eg gen 1 breaks down to version groups "red-blue" and "yellow"
        var allowedVersionGroups = response.version_groups.map((vg) => vg.name);
        return getPokemonMoveLevelList(pokemonName, allowedVersionGroups);
      });
    } else {
      // if a specific game is specified ("ruby") then we just find the version group associated
      // with that game and that is what we use to filter down the move-level-list
      return dex.getVersionByName(`${genFilter}`).then(function(response) {
        var allowedVersionGroups = [response.version_group.name];
        return getPokemonMoveLevelList(pokemonName, allowedVersionGroups);
      });
    }
  
  }

function capitalize(str) {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function execute(pokemon, genArg) {
    var pokemon = pokemon.toLowerCase();
    if (!pokemon) {
        return 'Usage: To get the levels at which Bulbasaur learns moves in Gen 3: "!moves Bulbasaur +3" or "!moves Bulbasaur +firered"'
    }
    const genFilter = genArg ? genArg.slice(1) : genstate.get(cmd.getCurrentMessageContext().channel);
    if (!genFilter) {
      return "Must provide generation filter or set one separately ('!setgen firered' or '!moves bulbasaur +leafgreen'";
    }
    return getPokemonMoves(pokemon, genFilter).then((data) => {
        const moveLevelList = [...data];
        if (moveLevelList.length === 0) {
        return `${capitalize(pokemon)} learns no moves in generation "${genFilter}"`;
        }
        const moves = moveLevelList.join(', ');
        return `(Gen "${genFilter}") ${capitalize(pokemon)} learns moves at the following levels: ${moves}`;
    }).catch(function(err) {
        console.log(err);
        return `No pokemon found by name ${capitalize(pokemon)} in gen "${genFilter}"`;
    });
}

module.exports = {
    executeFunction: execute,
    invoker: '!moves',
    tags: ["moves"]
}