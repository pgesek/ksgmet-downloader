const Fetcher = require('./fetcher.js');
const FileFetcher = require('./file_fetcher.js');  
const log = require('../util/log.js');

class CacheFetcher extends Fetcher {

    constructor(baseUrl, dirPath, store) {
        super(baseUrl, dirPath, store);
    }

    async fetchDirectory() {
        log.info('Fetching cache directory: ' + this.dirUrl);

        const listing = await this._fetchListing('');

        log.info('Ensuring directory structure exists for CACHE')
        await this.store.ensureDirStructure(
            this._savePath(listing.getPath()));

        log.debug('Retrieving cache files from listing: ' + listing.getPath());
        await this._fetchListingFiles(listing);

        log.info('Cache downloaded');
    }

    async _fetchListingFiles(listing) {
        const files = listing.getAllFileNames();
        const promises = [];

        files.forEach(fileName => {
            const fetchPromise = new Promise((resolve, reject) => {
                const fetchUrl = this._buildUrl(listing.getPath(),
                    fileName);

                FileFetcher.fetch(fetchUrl).then(response => {
                    this.store.save(this._savePath(listing.getPath()), 
                        fileName, response.body)
                    .then(() => resolve()) 
                    .catch(err => reject(err));
                }).catch(err => reject(err));
            });
            
            promises.push(fetchPromise);
        });

        return Promise.all(promises);
    }
}

module.exports = CacheFetcher;
