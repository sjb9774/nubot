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
dex.getGenerationsList().then((response) => {
    Promise.all(response.results.map((info, i) => {
        return dex.getGenerationByName(info.name).then((response) => {
            return Promise.all(response.version_groups.map((vgData) => {
                return vgData.name;
            })).then((vgroups) => {
                return Promise.all(vgroups.map((vgroup) => {
                    return dex.getVersionGroupByName(vgroup).then((vgroupData) => vgroupData.versions.map((v) => v.name));
                }));
            }).then((versions) => {
                return { versions: versions.flat(), index: i, generation: info.name};
            });
        });
    })).then((results) => {
        fs.writeFile('./gen/genindex.json', JSON.stringify(results), () => {
            process.exit();
        });
    });
});