const fs = require('fs');
const os = require('os');
const path = require('path');
const mkdirRec = require('mkdir-recursive');
const targz = require('targz');
const moment = require('moment-timezone');

class TmpFileStore {

    constructor() {
        this.ZONE = 'Europe/Warsaw';

        this.tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'ksgmet-downloader-'));

        console.log('Store constructed. Tmp directory: ' +
            this.tmpDir);
    }

    save(subPath, name, body) {
        return new Promise((resolve, reject) => {
            console.log(`Saving ${name} to ${subPath}`);

            const destDirPath = path.join(this.tmpDir, subPath);
            const destFilePath = path.join(destDirPath, name);

            mkdirRec.mkdir(destDirPath, err => {
                if (err) reject(err);   
                
                const dest = fs.createWriteStream(destFilePath);
                
                body.pipe(dest);

                body.on('error', err => {
                    reject(err);
                });
                dest.on('finish', () => {
                    console.log(`Saved ${name} to ${subPath}`);
                    resolve(destFilePath);
                });
                dest.on('error', err => {
                    reject(err);
                });
            });
        });
    }

    tarStore() {
        return new Promise((resolve, reject) => {
            const dt = new Date();
            
            const format = 'YYYY_MM_DD_hh_mm_ss';
            const dateString = moment(dt, format).tz(this.ZONE)
                .format(format);
        
            const fileName = 'ksgmet_' + dateString + '.tar.gz';
            const filePath = path.join(os.tmpdir(), fileName);

            console.log('Creating tar: ' + filePath);

            targz.compress({
                src: this.tmpDir,
                dest: filePath
            }, err => {
                if (err) reject(err);

                console.log('Tar saved: ' + filePath);
                resolve(filePath);
            })
        });
    }
}

module.exports = TmpFileStore;
