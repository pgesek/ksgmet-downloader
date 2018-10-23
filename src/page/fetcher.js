const FileFetcher = require('./file_fetcher.js');  
const HtmlListing = require('./html_listing.js');
const log = require('../util/log.js');
const path = require('path');
const UrlUtil = require('../util/url_util.js');

class Fetcher {
    
    constructor(baseUrl, dirPath, store) {
        this.baseUrl = baseUrl;
        this.dirPath = dirPath;
        this.dirUrl = UrlUtil.buildUrl(baseUrl, dirPath);

        this.store = store;
    }

    async fetchDirectory() {
        throw new Error('fetchDirectory() method needs to be implemented');
    }

    _fetchListing(listingPath) {
        const fetchUrl = this._buildUrl(listingPath);
        return new Promise((resolve, reject) => {
            FileFetcher.fetch(fetchUrl).then(response => {
                response.text().then(body => {
                    const listing = new HtmlListing(body, 
                        listingPath);
               
                    log.debug('Listing retrieved from: ' + 
                        listing.getPath());
                        
                    resolve(listing);
                });
            }).catch(err => {
                const errMsg = `Response ${err} received for ${listingPath}`;
                if (err === 404) {
                    log.error(errMsg);
                    resolve(null);
                }
                reject(errMsg);
            });
        });
    }

    _buildUrl(fetchPath, file) {
        return UrlUtil.buildUrl(this.dirUrl, fetchPath, file);
    }

    _savePath(filePath) {
        return path.posix.join(this.dirPath, filePath); 
    }
}

module.exports = Fetcher;
