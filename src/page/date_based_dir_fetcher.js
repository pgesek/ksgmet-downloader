const LatestDateRetriever = require('./latest_date_retriever.js');
const HtmlListing = require('./html_listing.js');

class DateBasedDirFetcher {

    constructor(dirUrl, store) {
        this.dirUrl = dirUrl;
        this.latestDateRetriever = new LatestDateRetriever(dirUrl);
        this.lastModDate = null;
        this.store = store;
    }

    async fetchDirectory() {
        const fetchDate = await this.latestDateRetriever.retrieveLatestDate();
        
        // TODO
        while(true) {
            const listing = await this._fetchListing(fetchDate);
            
            await this._fetchListingFiles(listing, this.store);
            
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

    _fetchListingFiles(listing, store) {
        const files = listing.getAllFileNames();
        const promises = [];

        files.forEach(fileName => {
            const fetchUrl = this._buildUrl(listing.getFetchPath(),
                fileName);
            
            const fetchPromise = new Promise((resolve, reject) => {
                FileFetcher.fetch(fetchUrl).then(response => {
                    response.text().then(body => {
                        store.save(listing.getFetchPath(), 
                            fileName, body).then(() => {
                                resolve();
                        }).catch(err => reject(err));
                    });
                }).catch(err => reject(err));
            });

            promises.push(fetchPromise);
        });

        return Promise.all(promises);
    }

    _buildUrl(fetchPath, file) {
        return UrlUtil.buildUrl(this.baseUrl, fetchPath, file);
    }
}

module.exports = DateBasedDirFetcher;
