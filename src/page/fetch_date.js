class FetchDate {

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
}

module.exports = FetchDate;
