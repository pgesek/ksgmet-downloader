fs = require('fs');

class HttpMocks {
    static async mockCsvPoland2018(mockServer) {
        this.mockIndex(mockServer, '/CSV/poland/');
        this.mockIndex(mockServer, '/CSV/poland/2018/');
        this.mockFile(mockServer, '/CSV/poland/2018/current.nfo');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/13/');
        this.mockIndex(mockServer, '/CSV/poland/2018/10/13/12/');
    }

    static async mockIndex(mockServer, path) {
        await mockServer.get(path)
            .thenReply(200, this.readFile(path + 'index.html'));    
    }

    static async mockFile(mockServer, path) {
        await mockServer.get(path)
            .thenReply(200, this.readFile(path));    
    }

    static readFile(path) {
        return fs.readFileSync('spec/data/mock_http' + path);
    }
}

module.exports = HttpMocks;