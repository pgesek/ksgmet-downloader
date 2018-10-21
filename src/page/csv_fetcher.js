const LatestDateRetriever = require('./latest_date_retriever.js');
const HtmlListing = require('./html_listing.js');
const ModifiedDates = require('./modified_dates.js');
const UrlUtil = require('../util/url_util.js');
const FileFetcher = require("./file_fetcher.js");  

const MOD_DATE_FILENAME = 'modified_dates.json';
const CURRENT_NFO_FILENAME = 'current.nfo';

class CsvFetcher {

    constructor(dirUrl, store, hoursToFetch, decrementStep = 1) {
        this.dirUrl = dirUrl;
        this.store = store;
        this.hoursToFetch = hoursToFetch;

        this.latestDateRetriever = new LatestDateRetriever(dirUrl);
        
        this.lastModDate = null;
        this.currentNfoYears = [];
        this.decrementStep = decrementStep;
    }

    async fetchDirectory() {
        console.log('Fetching CSV directory: ' + this.dirUrl);

        const fetchDate = await this.latestDateRetriever.retrieveLatestDate();
        
        console.log('Latest fetch date resolved to: ' +
            fetchDate.toPath());

        let fetchCount = 0;
        while(fetchCount < this.hoursToFetch) {
            console.log('Checking for current.nfo');
            this._fetchCurrentNfoIfMissing(fetchDate);

            console.log('Retrieving listing from: ' + fetchDate.toPath());
            const listing = await this._fetchListing(fetchDate);
            
            console.log('Retrieving files from listing: ' + listing.getPath());
            await this._fetchListingFiles(listing);
            
            fetchDate.decrement(this.decrementStep);
            fetchCount += this.decrementStep;
        }

        console.log('Done after ' + fetchCount + ' steps');
    }

    _fetchListing(fetchDate) {
        const fetchUrl = this._buildUrl(fetchDate.toPath());
        return new Promise((resolve, reject) => {
            FileFetcher.fetch(fetchUrl).then(response => {
                response.text().then(body => {
                    const listing = new HtmlListing(body, 
                        fetchDate.toPath());
               
                    console.log('Listing retrieved from: ' + 
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

                    this.store.save(listing.getPath(), 
                        fileName, response.body)
                    .then(() => { 
                        console.log(`Saving modified date ` + modDate +
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
                console.log('All files retrieved for listing: ' +
                    listing.getPath());

                this.store.saveString(listing.getPath(), 
                    MOD_DATE_FILENAME, modDates.print()
                ).then(() => resolve())
                .catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }

    _fetchCurrentNfoIfMissing(fetchDate) {
        const year = fetchDate.getYear();
        console.log('Checking current.nfo for year: ' + year);

        if (!this.currentNfoYears.includes(year)) {                         
            this.currentNfoYears.push(year)

            const nfoPath = year + '/';
            const fetchUrl = this._buildUrl(nfoPath, CURRENT_NFO_FILENAME);

            console.log('Fetching current.nfo from: ' + fetchUrl);

            return new Promise((resolve, reject) => {
                FileFetcher.fetch(fetchUrl).then(response => {
                    console.log('Storing current.nfo at: ' + nfoPath);
                    this.store.save(nfoPath, 
                        CURRENT_NFO_FILENAME, response.body)
                    .then(() => resolve())
                    .catch(err => reject(err));
                }).catch(err => reject(err));
            });
        } else {
            console.log('current.nfo already downloaded for ' + year);
        }
    }  

    _buildUrl(fetchPath, file) {
        return UrlUtil.buildUrl(this.dirUrl, fetchPath, file);
    }
}

module.exports = CsvFetcher;
