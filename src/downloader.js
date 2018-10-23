const CacheFetcher = require('./page/cache_fetcher.js');
const CsvFetcher = require('./page/csv_fetcher.js');
const fs = require('fs');
const log = require('./util/log.js');
const moment = require('moment-timezone');
const S3Uploader = require('./persistence/s3_uploader.js');
const settings = require('./util/settings.js');
const TmpFileStore = require('./persistence/tmp_file_store.js');

class Downloader {

    constructor() {
        this.ZONE = 'Europe/Warsaw';
        
        this.store = new TmpFileStore();
        this.prefix = this._generatePrefix();
        this.s3uploader = new S3Uploader(settings.S3_BUCKET_NAME, 
            this.prefix);
    }

    async download() {
        log.info('Starting download from ' + settings.SERVER_URL);
        log.info('Saving under prefix: ' + this.prefix);

        await this._fetchPlCsv();
        await this._fetchEuLongCsv();
        await this._fetchPlCache();

        log.info('Done')
    }

    async _fetchPlCsv() {
        const baseUrl = settings.SERVER_URL;
        const csvPath = settings.PL_CSV_PATH; 
        const hours = settings.PL_CSV_FETCH_HOURS;
        const step = settings.PL_CSV_STEP;
        const errLimit = settings.PL_CSV_ERROR_LIMIT;

        log.info(`Fetching last ${hours} PL CSV from: ` +
            `${baseUrl}, path: ${csvPath}. Step used: ${step} ` +
            `404 error limit: ${errLimit}`);
        
        const plCsvFetcher = new CsvFetcher(baseUrl, csvPath, this.store,
                hours, step, errLimit);
                
        const saveCallback = this._createCsvSaveCallBack('pl_csv');
        await plCsvFetcher.fetchDirectory(saveCallback);

        log.info('PL CSV fetch completed');
    }

    async _fetchEuLongCsv() {
        const baseUrl = settings.SERVER_URL;
        const csvPath = settings.EU_LONG_CSV_PATH; 
        const hours = settings.EU_LONG_CSV_FETCH_HOURS;
        const step = settings.EU_LONG_CSV_STEP;
        const errLimit = settings.EU_LONG_ERROR_LIMIT;

        log.info(`Fetching last ${hours} Europe Long CSV from: ` + 
            `${baseUrl}, path: ${csvPath}. Step used: ${step} ` +
            `404 error limit: ${errLimit}`);

        const euLongCsvFetcher = new CsvFetcher(baseUrl, csvPath, this.store,
            hours, step, errLimit);

        const saveCallback = this._createCsvSaveCallBack('europe_long_csv');
        await euLongCsvFetcher.fetchDirectory(saveCallback);

        log.info('Europe Long CSV fetch completed');
    }

    async _fetchPlCache() {
        const baseUrl = settings.SERVER_URL;
        const cachePath = settings.PL_CACHE_PATH;
        
        log.info(`Fetching PL Cache from Long CSV from: ` + 
            `${baseUrl}, path: ${cachePath}.`);

        const plCacheFetcher = new CacheFetcher(baseUrl, cachePath, 
            this.store);

        await plCacheFetcher.fetchDirectory();

        log.info('PL Cache download completed');

        const tarfile = awaitthis.store.tarStore('cache.tar.gz');
        await this._uploadToS3AndRm(tarfile);

        await this.store.clearStore();
    }

    async _uploadToS3AndRm(tarPath) {
        if (settings.UPLOAD_TO_S3) {
            log.info('Uploading tar to S3');
            
            await this.s3uploader.uploadFile(tarPath);
            
            fs.unlinkSync(tarPath);           
        } else {
            log.info('S3 upload disabled');
        }
    }

    _createCsvSaveCallBack(filePrefix) {
        return async tag => {
            log.info('Persisting CSV callback after a day fetched');

            const fileName = `${filePrefix}_${tag}.tar.gz`;
            const tarPath = await this.store.tarStore(fileName);
            
            await this._uploadToS3AndRm(tarPath);

            await this.store.clearStore();

            log.info('Callback finished');
        };
    }

    _generatePrefix() {
        const format = 'YYYY_MM_DD_HH_mm_ss';
        return moment(new Date(), format).tz(this.ZONE).format(format);
    }
}

module.exports = Downloader;
