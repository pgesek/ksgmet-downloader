const DirFetcher = require('../src/page/dir_fetcher.js');
const ServerMock = require('mock-http-server');
const HttpMocks = require('./http_mocks.js');

const mockServer = new ServerMock({ host: "localhost", port: 9700 });

beforeEach(done => mockServer.start(done));

afterEach(done => mockServer.stop(done));

describe('Directory Fetcher', () => {
    it('should fetch directory', async () => {
        const baseUrl = 'http://localhost:9700/CSV/poland';
        const store = { save: function() {
            console.log('Saving');
            return new Promise(resolve => resolve());
        }};
        spyOn(store, 'save').and.callThrough();
        HttpMocks.mockCsvPoland2018(mockServer);

        const dirFetcher = new DirFetcher(baseUrl, store, 2);
        await dirFetcher.fetchDirectory();

        expect(store.save).toHaveBeenCalledWith('2018/10/13/11/', 'testfile.csv', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('2018/10/13/12/', 'ACM_CONVECTIVE_PERCIP.csv', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('2018/10/13/12/', 'ACM_CONVECTIVE_PERCIP.csv.jpg', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('2018/10/13/12/', 'WVC.csv', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('2018/10/13/11/', 'modified_dates.json', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('2018/10/13/12/', 'modified_dates.json', jasmine.any(String));
        expect(store.save).toHaveBeenCalledWith('2018/', 'current.nfo', jasmine.any(String));
    });
});