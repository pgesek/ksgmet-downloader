const FileFetcher = require("./file_fetcher.js");  
const FetchDate = require("./fetch_date.js");  
const HtmlListing = require("./html_listing.js");  
const log = require('../util/log.js');
const UrlUtil = require('../util/url_util.js');

class LatestDateRetriever {
    
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    retrieveLatestDate() {
        log.debug('Retrieving last date path');

        const fetchDate = new FetchDate();
        return new Promise((resolve, reject) => {
            this._retrievePart(fetchDate)
                .then(date => resolve(date))
                .catch(err => reject(err));
        });
    }

    _retrievePart(fetchDate) {
        const fetchUrl = this._buildUrl(fetchDate);
        
        log.debug('Searching for latest date in path :' + 
            fetchDate.toPath());

        return new Promise((resolve, reject) => {
            FileFetcher.fetch(fetchUrl).then(response => {
                response.text().then(body => {
                    this._handleListingResponse(body, fetchDate,
                        resolve, reject);
                });
            }).catch(err => reject(err));
        });
    }

    _handleListingResponse(body, fetchDate, resolve, reject) {
        const listing = new HtmlListing(body);
        const part = listing.getLastNumericHrefVal();

        if (!part) {
            reject("Unable to retrieve latest path. Stopped at " +
                fetchDate.toPath());
        }

        fetchDate.addNextPart(part);

        log.debug('Found next part. Date: ' + fetchDate.toPath());

        if (fetchDate.isComplete()) {
            log.info('Fetch date complete: ' + fetchDate.toPath());
            resolve(fetchDate);
        } else {
            this._retrievePart(fetchDate)
                .then(date => resolve(date))
                .catch(err => reject(err));
        }
    }

    _buildUrl(fetchDate) {
        return UrlUtil.buildUrl(this.baseUrl, fetchDate.toPath());
    }
}

module.exports = LatestDateRetriever;
