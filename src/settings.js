function getSetting(varName, defaultVal) {
    const setting = process.env[varName];
    if (setting === undefined && defaultVal !== undefined) {
        setting = defaultVal;
    }
    return setting;
}

module.exports = Object.freeze({
    SERVER_URL: getSetting('SERVER_URL'),
    PL_CSV_URL: getSetting('PL_CSV_URL', 'prognozy/CSV/poland/'),
    PL_CSV_STEP: getSetting('PL_STEP', '1'),
    PL_CSV_FETCH_HOURS: getSetting('PL_FETCH_HOURS', 48),
    EUROPE_LONG_CSV_URL: getSetting('PL_CSV_URL', 'prognozy/CSV/europe_long/'),
    EUROPE_LONG_CSV_STEP: getSetting('EUROPE_LONG_STEP', '3'),
    EUROPE_LONG_CSV_FETCH_HOURS: getSetting('EUROPE_LONG_FETCH_HOURS', 7 * 24)
});
