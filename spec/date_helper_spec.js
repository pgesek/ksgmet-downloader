const DateHelper = require('../src/date_helper.js');


describe('date helper', function() {
    it('should parse dates to paths', function() {
        const date = new Date('2018-10-07 03:58:33');
        expect(DateHelper.dateToPath(date)).toEqual('2018/10/7/3');
    });
});