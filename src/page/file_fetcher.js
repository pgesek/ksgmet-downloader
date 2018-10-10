const http = require('http');

class FileFetcher {
    static fetchAndSave(url, file) {
        this.fetchAndExec(url, function(response) {
            if (response.statusCode !== 200) {
                throw `Respone ${response.statusCode} while fetching ${url}`;
            }

            response.pipe(file);
        });
    }

    static fetchAndExec(url, callback) {
        http.get(url, response => {
            if (response.statusCode !== 200) {
                throw `Respone ${response.statusCode} while fetching ${url}`;
            }
            
            callback(response);
        });
    }
}

module.exports = FileFetcher;