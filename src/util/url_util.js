const url = require('url');

class UrlUtil {
    static buildUrl(base, path) {
        const baseParsed = base.endsWith('/') ? 
            base : base + '/';
        
        return url.resolve(baseParsed, path);
    }
}

module.exports = UrlUtil;