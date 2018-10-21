class ModifiedDates {

    constructor() {
        this.dates = {};
    }

    registerModDate(filename, date) {
        this.dates[filename] = date;
    }

    print() {
        return JSON.stringify(this.dates, null, 2);
    }
}

module.exports = ModifiedDates;
