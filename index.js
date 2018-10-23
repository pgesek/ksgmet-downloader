'use strict';

const Downloader = require('./src/downloader.js');

exports.handler = async event => {
    let downloader = new Downloader();
    await downloader.download();
}
