class DateHelper {
    static dateToPath(date) {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}`;
    }
}

module.exports = DateHelper;