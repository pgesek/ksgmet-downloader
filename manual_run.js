const Downloader = require('./src/downloader.js');

const downloader = new Downloader();
downloader.download().then(() => console.log('Script finished'));
