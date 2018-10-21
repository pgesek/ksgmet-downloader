const AWS = require('aws-sdk');

class S3Uploader {

    constructor(bucketName) {
        this.bucketName = bucketName;
    }
}

module.exports = S3Uploader;
