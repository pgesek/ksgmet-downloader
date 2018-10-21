const CacheFetcher = require('../../src/page/cache_fetcher.js');
const ServerMock = require('mock-http-server');
const HttpMocks = require('../test-util/http_mocks.js');

const mockServer = new ServerMock({ host: "localhost", port: 9701 });

beforeEach(done => mockServer.start(done));

afterEach(done => mockServer.stop(done));

describe('Cache Fetcher', () => {
    it('should fetch directory', async () => {
        const baseUrl = 'http://localhost:9701/';
        const csvPath = '/CACHE/poland';
        const store = { 
            save: function(path, file) {
                return new Promise(resolve => resolve());
            }
        };
        spyOn(store, 'save').and.callThrough();
        HttpMocks.mockCsvPoland2018(mockServer);

        const cacheFetcher = new CacheFetcher(baseUrl, csvPath, store);
        await cacheFetcher.fetchDirectory();

        expect(store.save).toHaveBeenCalledWith('/CACHE/poland', 
            '147_143_91_1_0_0_0_0_21_10_2018_0_HIGH_CLOUD_FRACTION.bin', jasmine.anything());
        expect(store.save).toHaveBeenCalledWith('/CACHE/poland', 
            '147_143_91_1_0_0_0_0_21_10_2018_0_LOW_CLOUD_FRACTION.bin', jasmine.anything());
        
    });
});