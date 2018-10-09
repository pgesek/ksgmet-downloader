'use strict';

const Downloader = require('./src/downloader.js');

module.exports = function handler(event, context, callback) {
    let downloader = new Downloader();
    downloader.download();
}
