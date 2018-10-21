const CsvFetcher = require('./page/csv_fetcher.js');
const log = require('./util/log.js');
const Settings = require('./util/settings.js');
const TmpFileStore = require('./persistence/tmp_file_store.js');

class Downloader {

    async download() {
        log.info('Starting download from ' + Settings.SERVER_URL);
        
        const tmpFileStore = new TmpFileStore();

        await this._fetchPlCsv(tmpFileStore);
        await this._fetchEuLongCsv(tmpFileStore);

        await tmpFileStore.tarStore();

        log.info('Download completed')
    }

    async _fetchPlCsv(store) {
        const baseUrl = Settings.SERVER_URL;
        const csvPath = Settings.PL_CSV_URL; 
        const hours = Settings.PL_CSV_FETCH_HOURS;
        const step = Settings.PL_CSV_STEP;

        log.info(`Fetching last ${hours} PL CSV from: ` +
            `${baseUrl}, path: ${csvPath}. Step used: ${step}`);
        
        const plCsvFetcher = new CsvFetcher(baseUrl, csvPath, store, 
            hours, step);

        await plCsvFetcher.fetchDirectory();

        log.info('PL CSV fetch completed');
    }

    async _fetchEuLongCsv(store) {
        const baseUrl = Settings.SERVER_URL;
        const csvPath = Settings.EUROPE_LONG_CSV_URL; 
        const hours = Settings.EUROPE_LONG_CSV_FETCH_HOURS;
        const step = Settings.EUROPE_LONG_CSV_STEP;

        log.info(`Fetching last ${hours} Europe Long CSV from: ` + 
            `${baseUrl}, path: ${csvPath}. Step used: ${step}`);

        const euLongCsvFetcher = new CsvFetcher(baseUrl, csvPath, store, hours,
            step);

        await euLongCsvFetcher.fetchDirectory();

        log.info('Europe Long CSV fetch completed');
    }
}

module.exports = Downloader;
