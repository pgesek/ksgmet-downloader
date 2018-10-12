const FileFetcher = require("./file_fetcher.js");  
const FetchDate = require("./fetch_date.js");  
const HtmlListing = require("./html_listing.js");  
const UrlUtil = require('../util/url_util.js');

class LatestDateRetriever {
    
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    retrieveLatestDate() {
        const fetchDate = new FetchDate();
        return new Promise((resolve, reject) => {
            this.retrievePart(fetchDate)
                .then(date => resolve(date))
                .catch(err => reject(err));
        });
    }

    retrievePart(fetchDate) {
        const fetchUrl = this.buildUrl(fetchDate);
        return new Promise((resolve, reject) => {
            FileFetcher.fetchAndExec(fetchUrl).then(response => {
                response.text().then(body => {
                    this.handleListingResponse(body, fetchDate,
                        resolve, reject);
                });
            }).catch(err => reject(err));
        });
    }

    handleListingResponse(body, fetchDate, resolve, reject) {
        const listing = new HtmlListing(body);
        const part = listing.getLastNumericHrefVal();

        if (!part) {
            reject("Unable to retrieve latest path. Stopped at " +
                fetchDate.toPath());
        }

        fetchDate.addNextPart(part);

        if (fetchDate.isComplete()) {
            resolve(fetchDate);
        } else {
            this.retrievePart(fetchDate)
                .then(date => resolve(date))
                .catch(err => reject(err));
        }
    }

    buildUrl(fetchDate) {
        return UrlUtil.buildUrl(this.baseUrl, fetchDate.toPath());
    }
}

module.exports = LatestDateRetriever;
