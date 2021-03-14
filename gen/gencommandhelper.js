const genindex = require('./genindex.json');
const genstate = require('../gen/genstate.js');
const cmd = require('./../commands.js');

function parseGenFilterableCommand(...messagePieces) {
    let rawMessage = messagePieces.join(' ');
    let pokemonRegex = /^([^+]+)(?:\s+\+(.+))?$/;
    if (!pokemonRegex.test(rawMessage)) {
        return false;
    }
    let matches = rawMessage.split(pokemonRegex);
    let pokemon = matches[1];
    let genFilter = matches[2];

    if (!genFilter) {
        genFilter = genstate.get(cmd.getCurrentMessageContext().channel);
    }

    return [pokemon, genFilter];
}

function isGenFilterBeforeGen(genFilter, gen) {
    const gIndex = genindex.findIndex((genObject) => {
        return genObject.generation === gen;
    })
    var gfIndex = genindex.findIndex((genObject) => {
        return genObject.versions.indexOf(genFilter) !== -1
    });
    
    return gfIndex < gIndex;
}

return module.exports = {
    pokemonAndGenFilterParse: parseGenFilterableCommand,
    isGenFilterBeforeGen: isGenFilterBeforeGen
}