const fs = require('fs');

const STORAGE_PATH = `${__dirname}/generation_state.json`;

const VALID_GENERATIONS = [
    "red",
    "blue",
    "yellow",
    "gold",
    "silver",
    "crystal",
    "ruby",
    "sapphire",
    "emerald",
    "firered",
    "leafgreen",
    "diamond",
    "pearl",
    "platinum",
    "heartgold",
    "soulsilver",
    "black",
    "white",
    "colosseum",
    "xd",
    "black-2",
    "white-2",
    "x",
    "y",
    "omega-ruby",
    "alpha-sapphire",
    "sun",
    "moon",
    "ultra-sun",
    "ultra-moon",
    "lets-go-pikachu",
    "lets-go-eevee",
    "sword",
    "shield"
];

function getGenState(channelName) {
    if (!fs.existsSync(STORAGE_PATH)) {
        return null;
    }
    const stateData = fs.readFileSync(STORAGE_PATH);
    const stateJSON = JSON.parse(stateData);
    return stateJSON[channelName] || null;
}

function setGenState(channelName, gen) {
    if (VALID_GENERATIONS.indexOf(gen.toLowerCase()) === -1) {
        return false;
    }

    let stateJSON = {};
    if (fs.existsSync(STORAGE_PATH)) {
        const stateData = fs.readFileSync(STORAGE_PATH);
        stateJSON = JSON.parse(stateData);
    }
    stateJSON[channelName] = gen.toLowerCase();
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(stateJSON));
    return true;
}

module.exports = {
    get: getGenState,
    set: setGenState
}