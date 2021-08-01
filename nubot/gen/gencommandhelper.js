const genindex = require('./genindex.json');
const genstate = require('../gen/genstate.js');;

function parseGenFilterableCommand({args, getCurrentMessageContext}) {
    let messageContext = getCurrentMessageContext();
    // slice 1 to ignore command
    let rawMessage = args.slice(1).join(' ');
    let pokemonRegex = /^([^+]+)(?:\s+\+(.+))?$/;
    if (!pokemonRegex.test(rawMessage)) {
        return false;
    }
    let matches = rawMessage.split(pokemonRegex);
    let pokemon = matches[1];
    let genFilter = matches[2];

    if (!genFilter) {
        genFilter = genstate.get(messageContext.channel);
    }

    return [pokemon, genFilter];
}

function doesGenFilterApplyToGen(genFilter, gen) {
    const gIndex = genindex.findIndex((genObject) => {
        return genObject.generation === gen;
    })
    var gfIndex = genindex.findIndex((genObject) => {
        return genObject.versions.indexOf(genFilter) !== -1
    });
    
    return gfIndex <= gIndex;
}

return module.exports = {
    pokemonAndGenFilterParse: parseGenFilterableCommand,
    isGenFilterBeforeGen: doesGenFilterApplyToGen
}