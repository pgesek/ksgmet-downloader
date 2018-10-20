class FetchDate {

    constructor(year, month, day, hour) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
    }

    addNextPart(part) {
        if (!this.year) {
            this.year = part;
        } else if (!this.month) {
            this.month = part;
        } else if (!this.day) {
            this.day = part;
        } else if (!this.hour) {
            this.hour = part;
        } else {
            throw 'This date is already complete';
        }
    }

    toPath() {
        let path = '';
        if (this.year) {
            path += `${this.year}/`;
        }
        if (this.month) {
            path += `${this.month}/`;
        }
        if (this.day) {
            path += `${this.day}/`;
        }
        if (this.hour) {
            path += `${this.hour}/`;
        }
        return path;
    }

    isComplete() {
        return this.isDef(this.year) && this.isDef(this.month) && 
            this.isDef(this.day) && this.isDef(this.hour);
    }

    isDef(val) {
        return typeof val !== 'undefined';
    }

    decrement() {
        const dt = new Date(this.year, this.month - 1, this.day, 
            this.hour);
        dt.setHours(dt.getHours() - 1);

        this.year = dt.getFullYear();
        this.month = dt.getMonth() + 1;
        this.day = dt.getDate();
        this.hour = dt.getHours();
    }

    getYear() {
        return this.year;
    }
}

module.exports = FetchDate;
