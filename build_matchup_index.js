// generates a json "index" of pokemon generations to their respective version groups in the pokeco.api
// this solves for scenarios with pokemon like Clefable whose types have changed between games.
// the pokeco.api only returns a "past_type" field to detail this, which includes the past type and the last gen where it was that type.
// for scenarios where a gen filter is set for say gen 3 but the type changed in gen 5, we would have to do a lot of polling of the api
// to figure out if the game we're filtering on belongs to a gen that was before or after the type change.
// this index makes that calculus much simpler

const Pokedex = require('pokedex-promise-v2');
const fs = require('fs');

var genData = [];
const dex = new Pokedex();

// this code is incomprehensible to me, the author, but it works  --Stephen
dex.getTypesList().then((response) => {
    Promise.all(response.results.map((info, i) => {
        return dex.getTypeByName(info.name).then((response) => {
            const data = {};
            response.damage_relations.double_damage_to.forEach((t) => data[t.name] = 2);
            response.damage_relations.half_damage_to.forEach((t) => data[t.name] = .5);
            response.damage_relations.no_damage_to.forEach((t) => data[t.name] = 0);
            return {typeName: info.name, matchups: data};
        });
    })).then((results) => {
        let finalData = {};
        results.forEach((typeDataObject) => finalData[typeDataObject.typeName] = typeDataObject.matchups);
        fs.writeFile(`${__dirname}/matchup_index.json`, JSON.stringify(finalData), () => {
            process.exit();
        });
    });
});