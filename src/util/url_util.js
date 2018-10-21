const url = require('url');

class UrlUtil {
    static buildUrl(base, path, file = null) {
        const baseParsed = base.endsWith('/') ? 
            base : base + '/';
        
        let joinedUrl = url.resolve(baseParsed, path);

        if (file) {
            if (!joinedUrl.endsWith('/')) {
                joinedUrl += '/';
            }
            joinedUrl = url.resolve(joinedUrl, file);
        }

        return joinedUrl;
    }
}

module.exports = UrlUtil;
