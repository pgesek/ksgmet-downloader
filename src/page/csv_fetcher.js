const FileFetcher = require("./file_fetcher.js");  
const HtmlListing = require('./html_listing.js');
const LatestDateRetriever = require('./latest_date_retriever.js');
const log = require('../util/log.js');
const ModifiedDates = require('./modified_dates.js');
const path = require('path');
const UrlUtil = require('../util/url_util.js');

const MOD_DATE_FILENAME = 'modified_dates.json';
const CURRENT_NFO_FILENAME = 'current.nfo';

class CsvFetcher {

    constructor(baseUrl, dirPath, store, hoursToFetch, decrementStep = 1) {
        this.baseUrl = baseUrl;
        this.dirPath = dirPath;
        this.dirUrl = UrlUtil.buildUrl(baseUrl, dirPath);

        this.store = store;
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
        const fetchUrl = this._buildUrl(fetchDate.toPath());
        return new Promise((resolve, reject) => {
            FileFetcher.fetch(fetchUrl).then(response => {
                response.text().then(body => {
                    const listing = new HtmlListing(body, 
                        fetchDate.toPath());
               
                    log.debug('Listing retrieved from: ' + 
                        listing.getPath());
                        
                    resolve(listing);
                });
            }).catch(err => reject(err));
        });
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

    _buildUrl(fetchPath, file) {
        return UrlUtil.buildUrl(this.dirUrl, fetchPath, file);
    }

    _savePath(filePath) {
        return path.posix.join(this.dirPath, filePath); 
    }
}

module.exports = CsvFetcher;
