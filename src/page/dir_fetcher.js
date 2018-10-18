const LatestDateRetriever = require('./latest_date_retriever.js');
const HtmlListing = require('./html_listing.js');
const ModifiedDates = require('./modified_dates.js');
const UrlUtil = require('../util/url_util.js');
const FileFetcher = require("./file_fetcher.js");  

const MOD_DATE_FILENAME = 'modified_dates.json';

class DirFetcher {

    constructor(dirUrl, store, hoursToFetch) {
        this.dirUrl = dirUrl;
        this.store = store;
        this.hoursToFetch = hoursToFetch;

        this.latestDateRetriever = new LatestDateRetriever(dirUrl);
        this.lastModDate = null;
    }

    async fetchDirectory() {
        const fetchDate = await this.latestDateRetriever.retrieveLatestDate();
        
        let fetchCount = 0;
        while(fetchCount++ < this.hoursToFetch) {
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

                    modDates.registerModDate(fileName, modDate);

                    response.text().then(body => {
                        this.store.save(listing.getPath(), 
                            fileName, body)
                        .then(() => resolve())
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

    _buildUrl(fetchPath, file) {
        return UrlUtil.buildUrl(this.dirUrl, fetchPath, file);
    }
}

module.exports = DirFetcher;
