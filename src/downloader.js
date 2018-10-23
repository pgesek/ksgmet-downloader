const CacheFetcher = require('./page/cache_fetcher.js');
const CsvFetcher = require('./page/csv_fetcher.js');
const log = require('./util/log.js');
const S3Uploader = require('./persistence/s3_uploader.js');
const Settings = require('./util/settings.js');
const TmpFileStore = require('./persistence/tmp_file_store.js');

class Downloader {

    async download() {
        log.info('Starting download from ' + Settings.SERVER_URL);
        
        const tmpFileStore = new TmpFileStore();

        await this._fetchPlCsv(tmpFileStore);
        await this._fetchEuLongCsv(tmpFileStore);
        await this._fetchPlCache(tmpFileStore);

        log.info('Download completed')
        
        log.info('Creating tar');
        const tarFile = await tmpFileStore.tarStore();

        if (Settings.UPLOAD_TO_S3) {
            log.info('Uploading tar to S3');

            const bucketUploader = new S3Uploader(Settings.S3_BUCKET_NAME);
            await bucketUploader.uploadFile(tarFile);
        } else {
            log.info('S3 upload disabled');
        }

        log.info('Done');
    }

    async _fetchPlCsv(store) {
        const baseUrl = Settings.SERVER_URL;
        const csvPath = Settings.PL_CSV_URL; 
        const hours = Settings.PL_CSV_FETCH_HOURS;
        const step = Settings.PL_CSV_STEP;
        const errLimit = Settings.PL_CSV_ERROR_LIMIT;

        log.info(`Fetching last ${hours} PL CSV from: ` +
            `${baseUrl}, path: ${csvPath}. Step used: ${step} ` +
            `404 error limit: ${errLimit}`);
        
        const plCsvFetcher = new CsvFetcher(baseUrl, csvPath, store, 
            hours, step, errLimit);

        await plCsvFetcher.fetchDirectory();

        log.info('PL CSV fetch completed');
    }

    async _fetchEuLongCsv(store) {
        const baseUrl = Settings.SERVER_URL;
        const csvPath = Settings.EUROPE_LONG_CSV_URL; 
        const hours = Settings.EUROPE_LONG_CSV_FETCH_HOURS;
        const step = Settings.EUROPE_LONG_CSV_STEP;
        const errLimit = Settings.EUROPE_LONG_ERROR_LIMIT;

        log.info(`Fetching last ${hours} Europe Long CSV from: ` + 
            `${baseUrl}, path: ${csvPath}. Step used: ${step} ` +
            `404 error limti: ${errLimit}`);

        const euLongCsvFetcher = new CsvFetcher(baseUrl, csvPath, store, hours,
            step, errLimit);

        await euLongCsvFetcher.fetchDirectory();

        log.info('Europe Long CSV fetch completed');
    }

    async _fetchPlCache(store) {
        const baseUrl = Settings.SERVER_URL;
        const cachePath = Settings.PL_CACHE_URL;
        
        log.info(`Fetching PL Cache from Long CSV from: ` + 
            `${baseUrl}, path: ${cachePath}.`);

        const plCacheFetcher = new CacheFetcher(baseUrl, cachePath, 
            store);

        await plCacheFetcher.fetchDirectory();

        log.info('PL Cache donwload completed');
    }
}

module.exports = Downloader;
