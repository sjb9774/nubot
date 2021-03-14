function parseGenFilterableCommand(...messagePieces) {
    let rawMessage = messagePieces.join(' ');
    let pokemonRegex = /^([^+]+)(?:\s+(\+.+))?$/;
    if (!pokemonRegex.test(rawMessage)) {
        return false;
    }
    let matches = rawMessage.split(pokemonRegex);
    let pokemon = matches[1];
    let genFilter = matches[2];

    return [pokemon, genFilter];
}

return module.exports = {
    pokemonAndGenFilterParse: parseGenFilterableCommand
}