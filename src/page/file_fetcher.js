const fetch = require('node-fetch');
const log = require('../util/log.js');

class FileFetcher {

    static fetch(url, method = 'GET') {
        log.debug(`Fetching ${url} using ${method}`);
        return new Promise((resolve, reject) => {
            fetch(url, {method}).then(response => {
                log.debug(`Response status: ${response.status} for ${url}`);
                if (response.status !== 200) {
                    throw `Response ${response.status} while fetching ${url}`;
                }
                
                resolve(response);
            }).catch(err => reject(err));
        });
    }
}

module.exports = FileFetcher;
