const LatestDateRetriever = require('./latest_date_retriever.js');

class DateBasedDirFetcher {

    constructor(dirUrl, store) {
        this.dirUrl = dirUrl;
        this.latestDateRetriever = new LatestDateRetriever(dirUrl);
    }

    fetchDirectory() {
        this.latestDateRetriever.retrieveLatestDate(date => {
            
        });
    }
}

module.exports = DateBasedDirFetcher;
