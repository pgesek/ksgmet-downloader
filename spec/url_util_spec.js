const UrlUtil = require('../src/util/url_util.js');

describe('url util', () => {
    it('should join urls', () => {
        expect(UrlUtil.buildUrl('http://localhost:8080/csv/poland',
            '2017/10')).toEqual('http://localhost:8080/csv/poland/2017/10');
        expect(UrlUtil.buildUrl('http://localhost:8080/csv/poland/',
            '2017/10')).toEqual('http://localhost:8080/csv/poland/2017/10');
    })
})