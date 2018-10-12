const FetchDate = require('../src/page/fetch_date.js');

describe('fetch date', () => {
    it('should build path', () => {
        const fetchDate = new FetchDate();
        expect(fetchDate.toPath()).toEqual('');

        fetchDate.addNextPart('2018');
        expect(fetchDate.toPath()).toEqual('2018/');

        fetchDate.addNextPart('7');
        expect(fetchDate.toPath()).toEqual('2018/7/');

        fetchDate.addNextPart('27');
        expect(fetchDate.toPath()).toEqual('2018/7/27/');

        fetchDate.addNextPart('13');
        expect(fetchDate.toPath()).toEqual('2018/7/27/13/');
    });

    it('should complete after all parts', () => {
        const fetchDate = new FetchDate();
        expect(fetchDate.isComplete()).toEqual(false);

        fetchDate.addNextPart('2018');
        expect(fetchDate.isComplete()).toEqual(false);

        fetchDate.addNextPart('7');
        expect(fetchDate.isComplete()).toEqual(false);

        fetchDate.addNextPart('27');
        expect(fetchDate.isComplete()).toEqual(false);

        fetchDate.addNextPart('13');
        expect(fetchDate.isComplete()).toEqual(true);
    });

    it('should not allow adding parts after complete', () => {
        const fetchDate = new FetchDate();
        fetchDate.addNextPart('2011');
        fetchDate.addNextPart('7');
        fetchDate.addNextPart('14');
        fetchDate.addNextPart('33');

        expect(() => fetchDate.addNextPart('1'))
            .toThrow('This date is already complete');
    });
});