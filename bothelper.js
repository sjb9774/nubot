const bst = require('./bst.json');
const jw = require('jaro-winkler');
const dex = require('./pokedex.js');
const Pokedex = require('pokedex-promise-v2');
require('dotenv').config();
const DISABLED_COMMANDS = JSON.parse(process.env.DISABLED_COMMANDS || '[]');
console.log(`DISABLED: ${DISABLED_COMMANDS}`);

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

function handleCommand(commandName, rawMsg, user) {
  if (DISABLED_COMMANDS.indexOf(commandName) !== -1 ) {
    return;
  }
  if (commandName === '!bst') {
    const keyword = findKeyword(rawMsg, bst)
    if (keyword){
      if (keyword.toLowerCase() in bst) {
      var poke = keyword.charAt(0).toUpperCase() + keyword.slice(1); // Capitalize name
      return `${poke} base stat total: ${bst[keyword]}`
      }
      else {
        return "No pokemon with that name found.";
      }
    } else {
      return "BST stands for Base Stat Total, which is the sum of all\ stats that pokemon has in the base game. The randomizer randomly distributes stat\ points based on the pokemon, so the higher the better.";
    }

  } else if (commandName === '!skub') {
    var position = "POSITION"
    if ( setTeam(user) ) {
      position = "anti"
    } else {
      position = "pro"
    }
    return `@${user}, you are ${position}-skub.`;
  } else if (commandName === '!terry') {
    return 'RIP Terry :(';
  } else if (commandName === '!types') {
    const keyword = findKeyword(rawMsg, bst);
    if (keyword){
      if (keyword.toLowerCase() in dex.BattlePokedex) {
        var poke = capitalize(keyword);
        const stringTypes = dex.BattlePokedex[keyword.toLowerCase()]['types'].join(" and ");
        return `${poke} is ${stringTypes}`;
      }
    }
  } else if (commandName === '!moves') {
    const keyword = findKeyword(rawMsg, bst);
    if (!keyword) {
      return 'Usage: To get the levels at which Bulbasaur learns moves in Gen 3: "!moves Bulbasaur +3" or "!moves Bulbasaur +firered"'
    }
    const commandPieces = rawMsg.split('+');
    var genFilter;
    if (commandPieces.length > 1) {
      genFilter = commandPieces[commandPieces.length - 1];
    } else {
      return 'Generation filter required (eg "!moves Bulbasaur +blue" or "!moves Treecko +3")';
    }

    if (keyword) {
      return getPokemonMoves(keyword.toLowerCase(), genFilter).then((data) => {
        const moveLevelList = [...data];
        if (moveLevelList.length === 0) {
          return `${capitalize(keyword)} learns no moves in generation "${genFilter}"`;
        }
        const moves = moveLevelList.join(', ');
        return `(Gen "${genFilter}") ${capitalize(keyword)} learns moves at the following levels: ${moves}`;
      }).catch(function(err) {
        return `No pokemon found by name ${capitalize(keyword)} in gen "${genFilter}""`;
      });
    }
  }
}

// Finds keyword to a command by comparing to dict keys. Also finds multiword keywords
// as long as the full name directly follows the commandName
function findKeyword(message, dict) {
    const keys = Object.keys(dict)
    const words = message.split(' ')  // Splits up all words in message
    var i;
    for (i = 2; i <= words.length; i++){
        var kw = words.slice(1,i).join(" ").toLowerCase(); //ignore first entry in list
        var [m, r] = findBestMatch(kw, keys)
        const minRating = 0.90
        if (r >= minRating){
          console.log(`Found keyword: ${kw} as ${m}, with a rating of ${r}.`);
          return m;
        }
        else {
          console.log(`Searched for ${kw}, closest match was: ${m}
          with a rating of ${r}.\n`)}
          return kw // No good match, returns the keyword as given.
    }
    // Only gets here if message contains a valid command but no keyword at all
    console.log(`No keyword found in ${message}.\n`)
    return false; // returns False if no keyword provided
}


//Finds the closest match to keyword by finding the highest jaro-winkler rating among a list of keys. keyword should be a string and keys should be a list of strings.
function findBestMatch(keyword, keys){
  var rating = 0 // will return undefined if keys is empty
  let ratedKeys = keys.map(key => jw(keyword, key)) // rates entire list with jaro-winkler
  let highestRating = Math.max(...ratedKeys) // using spread operator
  // console.log(highestRating)
  var [match, rating] = [keys[ratedKeys.indexOf(highestRating)], highestRating]
  return [match, rating]
}


// Adds up the ASCII codes comprising a username and sets team based on whether or not it's even or odd. Not super complex and someone could easily reverse engineer this, but it's a pointless sorter anyway so there is no inherent reason to make this based off a secret hash seed.
function setTeam(name){
  // converts string to array of character codes of each string
  const vals = Array.prototype.map.call(name, char => {return char.charCodeAt(0)})

  // reduces character codes to a single sum value, starting from 0
  const sum = vals.reduce((a,b) => a + b, 0)

  return sum%2 // returns 0 if even, 1 if odd.
}

function capitalize(str) {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

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

module.exports = {
  handleCommand: handleCommand
}