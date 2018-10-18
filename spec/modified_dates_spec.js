const ModifiedDates = require('../src/page/modified_dates.js');

describe('modified dates', () => {
    it ('should print', () => {
        const dates = new ModifiedDates();
        dates.registerModDate('first.csv', '2018-10-20');
        dates.registerModDate('second.csv', '2011-05-20');
        dates.registerModDate('third.csv', '2018-04-22');

        const expected = JSON.parse(`{
            "first.csv": "2018-10-20",
            "second.csv": "2011-05-20", 
            "third.csv": "2018-04-22"
        }`);

        const actual = JSON.parse(dates.print());

        expect(actual).toEqual(expected);
    });
});