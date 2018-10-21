const FetchDate = require('../../src/page/fetch_date.js');

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

    it('should decrement', () => {
        let date = new FetchDate('2018', '3', '1', '0');
        date.decrement(1);
        expect(date.toPath()).toEqual('2018/2/28/23/');

        date = new FetchDate('2017', '4', '10', '22');
        date.decrement(1);
        expect(date.toPath()).toEqual('2017/4/10/21/');

        date = new FetchDate('2017', '4', '10', '22');
        date.decrement(3);
        expect(date.toPath()).toEqual('2017/4/10/19/');
    });

    it('should print 0 hour date', () => {
        const date = new FetchDate(2018, 3, 1, 0);
        expect(date.toPath()).toEqual('2018/3/1/0/')
    });
});