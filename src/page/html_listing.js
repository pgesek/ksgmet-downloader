const cherio = require('cherio');

class HtmlListing {
    constructor(content) {
        this.$ = cherio.load(content);
    }

    getLastNumericHrefVal() {
        let href = this.$('a').last().text();
        if (href) {
            href = href.replace(/\//, '');
        }
        return isNaN(href) ? undefined : href; 
    }    
}

module.exports = HtmlListing;
