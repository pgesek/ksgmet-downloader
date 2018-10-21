const Fetcher = require('./fetcher.js')
const FileFetcher = require('./file_fetcher.js'); 
const LatestDateRetriever = require('./latest_date_retriever.js');
const log = require('../util/log.js');
const ModifiedDates = require('./modified_dates.js');

const CURRENT_NFO_FILENAME = 'current.nfo';
const MOD_DATE_FILENAME = 'modified_dates.json';

class CsvFetcher extends Fetcher {

    constructor(baseUrl, dirPath, store, hoursToFetch, decrementStep = 1) {
        super(baseUrl, dirPath, store);

        this.hoursToFetch = hoursToFetch;

        this.latestDateRetriever = new LatestDateRetriever(this.dirUrl);
        
        this.lastModDate = null;
        this.currentNfoYears = [];
        this.decrementStep = decrementStep;
    }

    async fetchDirectory() {
        log.debug('Fetching CSV directory: ' + this.dirUrl);

        const fetchDate = await this.latestDateRetriever.retrieveLatestDate();
        
        log.info('Latest data date resolved to: ' +
            fetchDate.toPath());

        let fetchCount = 0;
        while(fetchCount < this.hoursToFetch) {
            log.debug('Checking for current.nfo');
            this._fetchCurrentNfoIfMissing(fetchDate);

            log.debug('Retrieving listing from: ' + fetchDate.toPath());
            const listing = await this._fetchListing(fetchDate);
            
            log.debug('Retrieving files from listing: ' + listing.getPath());
            await this._fetchListingFiles(listing);
            
            fetchDate.decrement(this.decrementStep);
            fetchCount += this.decrementStep;
        }

        log.info(`Done with ${this.dirUrl} after ${fetchCount} steps`);
    }

    _fetchListing(fetchDate) {
        return super._fetchListing(fetchDate.toPath());
    }

    _fetchListingFiles(listing) {
        const files = listing.getAllFileNames();
        const promises = [];
        const modDates = new ModifiedDates();

        files.forEach(fileName => {
            const fetchUrl = this._buildUrl(listing.getPath(),
                fileName);
            
            const fetchPromise = new Promise((resolve, reject) => {
                FileFetcher.fetch(fetchUrl).then(response => {
                    const modDate = response.headers.get('Last-Modified');

                    this.store.save(this._savePath(listing.getPath()), 
                        fileName, response.body)
                    .then(() => { 
                        log.debug(`Saving modified date ` + modDate +
                            ' for file ' + fetchUrl);

                        modDates.registerModDate(fileName, modDate);
                        resolve();
                    }).catch(err => reject(err));
                }).catch(err => reject(err));
            });

            promises.push(fetchPromise);
        });

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
                log.info('All files retrieved for listing: ' +
                    listing.getPath());

                this.store.saveString(
                    this._savePath(listing.getPath()), 
                    MOD_DATE_FILENAME, modDates.print()
                ).then(() => resolve())
                .catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }

    _fetchCurrentNfoIfMissing(fetchDate) {
        const year = fetchDate.getYear();
        log.debug('Checking current.nfo for year: ' + year);

        if (!this.currentNfoYears.includes(year)) {                         
            this.currentNfoYears.push(year)

            const nfoPath = year + '/';
            const fetchUrl = this._buildUrl(nfoPath, CURRENT_NFO_FILENAME);

            log.info('Fetching current.nfo from: ' + fetchUrl);

            return new Promise((resolve, reject) => {
                FileFetcher.fetch(fetchUrl).then(response => {
                    log.debug('Storing current.nfo at: ' + nfoPath);
                    this.store.save(this._savePath(nfoPath), 
                        CURRENT_NFO_FILENAME, response.body)
                    .then(() => resolve())
                    .catch(err => reject(err));
                }).catch(err => reject(err));
            });
        } else {
            log.debug('current.nfo already downloaded for year ' + year);
        }
    }  
}

module.exports = CsvFetcher;
