const fetch = require('node-fetch');

class FileFetcher {
    static fetchAndSave(url, file) {
        this.fetchAndExec(url, response => {
            if (response.status !== 200) {
                throw `Respone ${response.statusCode} while fetching ${url}`;
            }

            response.pipe(file);
        });
    }

    static fetchAndExec(url, callback) {
        console.log('Fetching: ' + url);
        fetch(url).then(response => {
            console.log('Response status: ' + response.status);
            if (response.status !== 200) {
                throw `Response ${response.status} while fetching ${url}`;
            }
            
            callback(response);
        })
        .catch(err => { throw err });
    }
}

module.exports = FileFetcher;