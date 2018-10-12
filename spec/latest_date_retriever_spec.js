const LatestDateRetriever = require('../src/page/latest_date_retriever.js');
const mockServer = require('mockttp').getLocal();
const HttpMocks = require('./http_mocks.js')

describe('latest date retriever', () => {
    
    beforeEach(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        await mockServer.start();
    });
    
    afterEach(() => mockServer.stop());

    it('should retrieve latest date', done => {
        HttpMocks.mockCsvPoland2018(mockServer).then(() => {
            const baseUrl = mockServer.urlFor('/CSV/poland');
            const retriever = new LatestDateRetriever(baseUrl);
    
            retriever.retrieveLatestDate().then(date => {
                expect(date.toPath()).toEqual('2018/10/13/12/');
                done();
            });
        });
    });
});