const CsvFetcher = require('../../src/page/csv_fetcher.js');
const ServerMock = require('mock-http-server');
const HttpMocks = require('../test-util/http_mocks.js');

const mockServer = new ServerMock({ host: "localhost", port: 9700 });

beforeEach(done => mockServer.start(done));

afterEach(done => mockServer.stop(done));

describe('CSV Fetcher', () => {
    it('should fetch directory', async () => {
        const baseUrl = 'http://localhost:9700/';
        const csvPath = '/CSV/poland';
        const store = { 
            save: function() {
                return new Promise(resolve => resolve());
            },
            saveString: function () {
                return new Promise(resolve => resolve());
            },
            ensureDirStructure() {
                return new Promise(resolve => resolve());
            },
            callback() {
            }
        };
        spyOn(store, 'save').and.callThrough();
        spyOn(store, 'saveString').and.callThrough();
        spyOn(store, 'ensureDirStructure').and.callThrough();
        spyOn(store, 'callback');

        HttpMocks.mockCsvPoland2018(mockServer);

        const csvFetcher = new CsvFetcher(baseUrl, csvPath, store, 2);
        await csvFetcher.fetchDirectory(store.callback);

        expect(store.save).toHaveBeenCalledWith('/CSV/poland/2018/10/13/11/', 'testfile.csv', jasmine.anything());
        expect(store.save).toHaveBeenCalledWith('/CSV/poland/2018/10/13/12/', 'ACM_CONVECTIVE_PERCIP.csv', jasmine.anything());
        expect(store.save).toHaveBeenCalledWith('/CSV/poland/2018/10/13/12/', 'ACM_CONVECTIVE_PERCIP.csv.jpg', jasmine.anything());
        expect(store.save).toHaveBeenCalledWith('/CSV/poland/2018/10/13/12/', 'WVC.csv', jasmine.anything());
        expect(store.saveString).toHaveBeenCalledWith('/CSV/poland/2018/10/13/11/', 'modified_dates.json', jasmine.any(String));
        expect(store.saveString).toHaveBeenCalledWith('/CSV/poland/2018/10/13/12/', 'modified_dates.json', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('/CSV/poland/2018/', 'current.nfo', jasmine.anything());
        expect(store.ensureDirStructure).toHaveBeenCalledWith('/CSV/poland/2018/10/13/11/');
        expect(store.ensureDirStructure).toHaveBeenCalledWith('/CSV/poland/2018/10/13/12/');
        expect(store.callback).toHaveBeenCalledWith('2018_10_13');
        expect(store.callback).toHaveBeenCalledTimes(1);
    });
});