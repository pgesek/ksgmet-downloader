const cherio = require('cherio');

class HtmlListing {
    constructor(content) {
        this.$ = cherio.load(content);
    }

    getLastNumericHrefVal() {
        let href = this.$('a')
            .filter(this.numericHrefFilter.bind(this))
            .last()
            .text();
        return this.dropSlash(href); 
    }   

    numericHrefFilter(index, element) {
        let text = element.lastChild.nodeValue;
        text = this.dropSlash(text);
        return text && !isNaN(text);
    }

    dropSlash(value) {
        return value ? value.replace(/\//, '') : value;
    }
}

module.exports = HtmlListing;
