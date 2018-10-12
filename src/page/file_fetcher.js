const fetch = require('node-fetch');

class FileFetcher {

    static fetchAndExec(url, callback) {
        console.log('Fetching: ' + url);
        return new Promise((resolve, reject) => {
            fetch(url).then(response => {
                console.log('Response status: ' + response.status);
                if (response.status !== 200) {
                    throw `Response ${response.status} while fetching ${url}`;
                }
                
                resolve(response);
            }).catch(err => reject(err));
        });
    }
}

module.exports = FileFetcher;