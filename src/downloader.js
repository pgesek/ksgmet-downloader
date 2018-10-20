const CsvFetcher = require('./page/csv_fetcher.js');
const UrlUtil = require('./util/url_util.js');
const Settings = require('./settings.js');
const TmpFileStore = require('./persistence/tmp_file_store.js');

class Downloader {

    download() {
        console.log('Starting Download');
        
        const tmpFileStore = new TmpFileStore();

        this._fetchPlCsv(tmpFileStore);
    }

    _fetchPlCsv(store) {
        const plCsvUrl = UrlUtil.buildUrl(Settings.SERVER_URL,
            Settings.PL_CSV_URL); 
        const hours = Settings.PL_CSV_FETCH_HOURS;
        const step = Settings.PL_CSV_STEP;

        console.log(`Fetching last ${hours} PL CSV from: ${plCsvUrl} 
            Step used: ${step}`);
        
        const plCsvFetcher = new CsvFetcher(plCsvUrl, store, hours, step);

        await plCsvFetcher.fetchDirectory();

        console.log('PL Csv fetch completed');
    }
}

module.exports = Downloader;
