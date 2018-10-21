const Downloader = require('./src/downloader.js');
const log = require('./src/util/log.js');

const downloader = new Downloader();
downloader.download().then(() => log.info('Script finished'));
