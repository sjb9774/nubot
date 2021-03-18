const Pokedex = require('pokedex-promise-v2');
const utils = require('../utils.js');
const matchupIndex = require('../../matchup_index.json');
const { capitalize } = require('../utils.js');

function attackArgParser(...argPieces) {
    if (argPieces.length < 2) {
        return null;
    }
    return [argPieces[0].toLowerCase(), argPieces[1].toLowerCase().split('/')];
}

function execute(attackingType, defendingTypes) {
   if (!attackingType || !defendingTypes || defendingTypes.length === 0 || defendingTypes.length > 2) {
       return "Usage: '!attack fire ice/grass"
   }

   const validTypes = ([attackingType, defendingTypes]).flat().reduce((currentValue, typeName) => {
        return currentValue && matchupIndex[typeName];
   }, true);
   if (!validTypes) {
       return "One or more types not valid";
   }

   let overallMultiplier = 1;
   defendingTypes.forEach((typeName) => {
        let multiplier = typeName in matchupIndex[attackingType] ? matchupIndex[attackingType][typeName] : 1;
        overallMultiplier *= multiplier;
   })
   return `${capitalize(attackingType)} deals ${overallMultiplier}x to ${defendingTypes.map(x => capitalize(x)).join('/')}.`;
}

module.exports = {
    executeFunction: execute,
    invoker: '!attack',
    tags: ["attack"],
    argResolver: attackArgParser
}