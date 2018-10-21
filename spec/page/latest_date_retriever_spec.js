const LatestDateRetriever = require('../../src/page/latest_date_retriever.js');
const ServerMock = require('mock-http-server');
const HttpMocks = require('../test-util/http_mocks.js');

describe('latest date retriever', () => {
    
    const mockServer = new ServerMock({ host: "localhost", port: 9000 });

    beforeEach(done => mockServer.start(done));
    
    afterEach(done => mockServer.stop(done));

    it('should retrieve latest date', done => {
        const baseUrl = 'http://localhost:9000/CSV/poland';
        HttpMocks.mockCsvPoland2018(mockServer);

        const retriever = new LatestDateRetriever(baseUrl);

        retriever.retrieveLatestDate().then(date => {
            expect(date.toPath()).toEqual('2018/10/13/12/');
            done();
        });
    });
});