const FileFetcher = require("./file_fetcher.js");  
const FetchDate = require("./fetch_date.js");  
const HtmlListing = require("./html_listing.js");  
const url = require('url');

class LatestDateRetriever {
    
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    retrieveLatestDate(callback) {
        const fetchDate = new FetchDate();
        this.retrievePart(fetchDate, callback);
    }

    retrievePart(fetchDate, callback) {
        const fetchUrl = this.buildUrl(fetchDate);
        FileFetcher.fetchAndExec(fetchUrl, response => {
            response.on('data', chunk => {
                const listing = new HtmlListing(chunk);
                const part = listing.getLastNumericHrefVal();

                if (!part) {
                    throw "Unable to retrieve latest path. Stopped at " +
                        fetchDate.toPath();
                }

                fetchDate.addNextPart(part);

                if (fetchDate.isComplete()) {
                    callback(fetchDate);
                } else {
                    this.retrievePart(fetchDate, callback);
                }
            });
        });
    }

    buildUrl(fetchDate) {
        return url.resolve(this.baseUrl, fetchDate.toPath());
    }
}

module.exports = LatestDateRetriever;
