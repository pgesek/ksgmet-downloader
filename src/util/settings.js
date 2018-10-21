require('dotenv').load();
const AWS = require('aws-sdk');

function getSetting(varName, defaultVal) {
    let setting = process.env[varName];
    if (setting === undefined && defaultVal !== undefined) {
        setting = defaultVal;
    }
    return setting;
}

const settings = Object.freeze({
    SERVER_URL: getSetting('SERVER_URL'),
    
    PL_CSV_URL: getSetting('PL_CSV_URL', 'prognozy/CSV/poland/'),
    PL_CSV_STEP: parseInt(getSetting('PL_STEP', '1')),
    PL_CSV_FETCH_HOURS: parseInt(getSetting('PL_FETCH_HOURS', 49)),
    
    EUROPE_LONG_CSV_URL: getSetting('PL_CSV_URL', 'prognozy/CSV/europe_long/'),
    EUROPE_LONG_CSV_STEP: parseInt(getSetting('EUROPE_LONG_STEP', '3')),
    EUROPE_LONG_CSV_FETCH_HOURS: parseInt(getSetting('EUROPE_LONG_FETCH_HOURS', 7 * 24)),

    PL_CACHE_URL: getSetting('PL_CACHE_URL', 'prognozy/CACHE/poland/'),

    LOG_LEVEL: 'info',

    UPLOAD_TO_S3: getSetting('UPLOAD_TO_S3', false),
    LOAD_AWS_CONFIG_FILE: getSetting('LOAD_AWS_CONFIG_FILE', false)
});

if (settings.LOAD_AWS_CONFIG_FILE) {
    AWS.config.loadFromPath('./.aws-config.json');
}

module.exports = settings;