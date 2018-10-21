const AWS = require('aws-sdk');
const fs = require('fs');
const log = require('../util/log.js');
const path = require('path');

const s3 = new AWS.S3();

class S3Uploader {

    constructor(bucketName) {
        this.bucketName = bucketName;
    }

    uploadFile(filePath) {
        log.info(`Uploading ${filePath} to ${this.bucketName}`);

        const fileName = path.basename(filePath);
        const fileStream = fs.createReadStream(filePath);

        const params = {
            Body: fileStream,
            Bucket: this.bucketName,
            Key: fileName,
            StorageClass: 'STANDARD_IA'
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }

                log.info(`Succesfuly uploaded ${fileName} to ${data.Location}`);

                resolve(data.Location);
            });
        });
    }
}

module.exports = S3Uploader;
