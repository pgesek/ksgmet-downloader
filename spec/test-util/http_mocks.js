const fs = require('fs');

class HttpMocks {
    static mockCsvPoland2018(mockServer) {
        this.mockIndex(mockServer, '/CSV/poland/');
        this.mockIndex(mockServer, '/CSV/poland/2018/');
        this.mockFile(mockServer, '/CSV/poland/2018/current.nfo');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/13/');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/13/12/');
        this.mockFile(mockServer, '/CSV/poland/2018/10/13/12/ACM_CONVECTIVE_PERCIP.csv');
        this.mockFile(mockServer, '/CSV/poland/2018/10/13/12/ACM_CONVECTIVE_PERCIP.csv.jpg');
        this.mockFile(mockServer, '/CSV/poland/2018/10/13/12/WVC.csv');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/13/11/');
        this.mockFile(mockServer, '/CSV/poland/2018/10/13/11/testfile.csv');

        this.mockIndex(mockServer, '/CACHE/poland/');
        this.mockFile(mockServer, '/CACHE/poland/147_143_91_1_0_0_0_0_21_10_2018_0_HIGH_CLOUD_FRACTION.bin');
        this.mockFile(mockServer, '/CACHE/poland/147_143_91_1_0_0_0_0_21_10_2018_0_LOW_CLOUD_FRACTION.bin');
    }

    static mockIndex(mockServer, path) {
        mockServer.on({
            method: 'GET',
            path: path,
            reply: {
                status: 200,
                body: this.readFile(path + 'index.html')
            }
        });    
    }

    static mockFile(mockServer, path, lastModDate) {
        mockServer.on({
            method: 'GET',
            path: path,
            reply: {
                status: 200,
                headers: { 'Last-Modified': lastModDate},
                body: this.readFile(path)
            }
        });
    }

    static readFile(path) {
        return fs.readFileSync('spec/test-data/mock_http' + path);
    }
}

module.exports = HttpMocks;