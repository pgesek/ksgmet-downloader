const CsvFetcher = require('./page/csv_fetcher.js');
const UrlUtil = require('./util/url_util.js');
const Settings = require('./settings.js');
const TmpFileStore = require('./persistence/tmp_file_store.js');

class Downloader {

    async download() {
        try { 
            console.log('Starting download from ' + Settings.SERVER_URL);
            
            const tmpFileStore = new TmpFileStore();

            await this._fetchPlCsv(tmpFileStore);

            await tmpFileStore.tarStore();

            console.log('Download completed')
        } catch (err) {
            throw err;
        }
    }

    async _fetchPlCsv(store) {
        const plCsvUrl = UrlUtil.buildUrl(Settings.SERVER_URL,
            Settings.PL_CSV_URL); 
        const hours = Settings.PL_CSV_FETCH_HOURS;
        const step = Settings.PL_CSV_STEP;

        console.log(`Fetching last ${hours} PL CSV from: ${plCsvUrl} ` + 
            `Step used: ${step}`);
        
        const plCsvFetcher = new CsvFetcher(plCsvUrl, store, hours, step);

        await plCsvFetcher.fetchDirectory();

        console.log('PL Csv fetch completed');
    }
}

module.exports = Downloader;
