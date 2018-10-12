const LatestDateRetriever = require('./latest_date_retriever.js');

class DateBasedDirFetcher {

    constructor(dirUrl, store) {
        this.dirUrl = dirUrl;
        this.latestDateRetriever = new LatestDateRetriever(dirUrl);
    }

    async fetchDirectory() {
        const fetchDate = await this.latestDateRetriever.retrieveLatestDate();
        
    }
}

module.exports = DateBasedDirFetcher;
