require('dotenv').load();
const AWS = require('aws-sdk');

function getSetting(varName, defaultVal, isBoolean) {
    let setting = process.env[varName];
    if (setting === undefined && defaultVal !== undefined) {
        setting = defaultVal;
    }

    if (isBoolean) {
        setting = setting !== 'false' && setting !== '0';
    }

    return setting;
}

const settings = Object.freeze({
    SERVER_URL: getSetting('SERVER_URL'),
    
    PL_CSV_PATH: getSetting('PL_CSV_PATH', 'prognozy/CSV/poland/'),
    PL_CSV_STEP: parseInt(getSetting('PL_STEP', '1')),
    PL_CSV_FETCH_HOURS: parseInt(getSetting('PL_FETCH_HOURS', 40)),
    PL_CSV_ERROR_LIMIT: parseInt(getSetting('PL_CSV_ERROR_LIMIT', 0)),

    EU_LONG_CSV_PATH: getSetting('EU_LONG_CSV_PATH', 'prognozy/CSV/europe_long/'),
    EU_LONG_CSV_STEP: parseInt(getSetting('EU_LONG_STEP', '3')),
    EU_LONG_CSV_FETCH_HOURS: parseInt(getSetting('EU_LONG_FETCH_HOURS', 7 * 24)),
    EU_LONG_ERROR_LIMIT: parseInt(getSetting('EU_LONG_CSV_ERROR_LIMIT', 3)),

    PL_CACHE_PATH: getSetting('PL_CACHE_PATH', 'prognozy/CACHE/poland/'),

    LOG_LEVEL: 'info',

    UPLOAD_TO_S3: getSetting('UPLOAD_TO_S3', false, true),
    LOAD_AWS_CONFIG_FILE: getSetting('LOAD_AWS_CONFIG_FILE', false, true),
    S3_BUCKET_NAME: getSetting('S3_BUCKET_NAME')
});

if (settings.LOAD_AWS_CONFIG_FILE) {
    AWS.config.loadFromPath('./.aws-config.json');
}

module.exports = settings;