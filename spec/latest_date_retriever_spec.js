const LatestDateRetriever = require('../src/page/latest_date_retriever.js');

describe('latest date retriever', () => {
    xit('should retrieve latest date', done => {
        const retriever = new LatestDateRetriever(process.env.CSV_URL);

        retriever.retrieveLatestDate(date => {
            expect(date.toPath()).toEqual('2018/10/12/12/');
            
            done();
        })   
    });
});