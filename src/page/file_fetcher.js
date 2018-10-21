const fetch = require('node-fetch');

class FileFetcher {

    static fetch(url, method = 'GET') {
        console.log(`Fetching ${url} using ${method}`);
        return new Promise((resolve, reject) => {
            fetch(url, {method}).then(response => {
                console.log(`Response status: ${response.status} for ${url}`);
                if (response.status !== 200) {
                    throw `Response ${response.status} while fetching ${url}`;
                }
                
                resolve(response);
            }).catch(err => reject(err));
        });
    }
}

module.exports = FileFetcher;