require('dotenv').config({path: `${__dirname}/.env`});

module.exports = {
    getEnvConfig: (envVar) => process.env[envVar.toUpperCase()]
}