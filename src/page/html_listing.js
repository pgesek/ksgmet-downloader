const cherio = require('cherio');

class HtmlListing {
    constructor(content) {
        this.$ = cherio.load(content);
    }

    getLastNumericHrefVal() {
        let href = this.$('a')
            .filter(this._numericHrefFilter.bind(this))
            .last()
            .text();
        return this._dropSlash(href); 
    }   

    getAllFileNames() {
        return this.$('a')
            .filter(this._hrefNotSpecialFilter.bind(this))
            .map(function(index, element) {
                return element.attribs.href;
            }).toArray();
    }

    _numericHrefFilter(index, element) {
        let text = element.lastChild.nodeValue;
        text = this._dropSlash(text);
        return text && !isNaN(text);
    }
    
    _hrefNotSpecialFilter(index, element) {
        const href = element.attribs.href;
        return href && !href.startsWith('/') && 
            !href.startsWith('?');
    }

    _dropSlash(value) {
        return value ? value.replace(/\//, '') : value;
    }
}

module.exports = HtmlListing;
