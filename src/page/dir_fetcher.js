const LatestDateRetriever = require('./latest_date_retriever.js');
const HtmlListing = require('./html_listing.js');
const ModifiedDates = require('./modified_dates.js');
const UrlUtil = require('../util/url_util.js');
const FileFetcher = require("./file_fetcher.js");  

const MOD_DATE_FILENAME = 'modified_dates.json';
const CURRENT_NFO_FILENAME = 'current.nfo';

class DirFetcher {

    constructor(dirUrl, store, hoursToFetch) {
        this.dirUrl = dirUrl;
        this.store = store;
        this.hoursToFetch = hoursToFetch;

        this.latestDateRetriever = new LatestDateRetriever(dirUrl);
        
        this.lastModDate = null;
        this.currentNfoYears = [];
    }

    async fetchDirectory() {
        const fetchDate = await this.latestDateRetriever.retrieveLatestDate();
        
        let fetchCount = 0;
        while(fetchCount++ < this.hoursToFetch) {
            this._fetchCurrentNfoIfMissing(fetchDate);

            const listing = await this._fetchListing(fetchDate);
            
            await this._fetchListingFiles(listing);
            
            fetchDate.decrement();
        }
    }

    _fetchListing(fetchDate) {
        const fetchUrl = this._buildUrl(fetchDate.toPath());
        return new Promise((resolve, reject) => {
            FileFetcher.fetch(fetchUrl).then(response => {
                response.text().then(body => {
                    const listing = new HtmlListing(body, 
                        fetchDate.toPath());
                    
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

                    response.text().then(body => {
                        this.store.save(listing.getPath(), 
                            fileName, body)
                        .then(() => { 
                            modDates.registerModDate(fileName, modDate);
                            resolve();
                        })
                        .catch(err => reject(err));

                    }).catch(err => reject(err));
                }).catch(err => reject(err));
            });

            promises.push(fetchPromise);
        });

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
                this.store.save(listing.getPath(), 
                    MOD_DATE_FILENAME, modDates.print())
                .then(() => resolve())
                .catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }

    _fetchCurrentNfoIfMissing(fetchDate) {
        const year = fetchDate.getYear();
        if (!this.currentNfoYears.includes(year)) {                         
            this.currentNfoYears.push(year)

            const nfoPath = year + '/';
            const fetchUrl = this._buildUrl(nfoPath, CURRENT_NFO_FILENAME);

            return new Promise((resolve, reject) => {
                FileFetcher.fetch(fetchUrl).then(response => {
                    response.text().then(body => {
                        this.store.save(nfoPath, 
                            CURRENT_NFO_FILENAME, body)
                        .then(() => resolve())
                        .catch(err => reject(err));
                    })
                }).catch(err => reject(err));
            });
        }
    }  

    _buildUrl(fetchPath, file) {
        return UrlUtil.buildUrl(this.dirUrl, fetchPath, file);
    }
}

module.exports = DirFetcher;
