const fs = require('fs');
const log = require('../util/log.js');
const mkdirRec = require('mkdir-recursive');
const moment = require('moment-timezone');
const os = require('os');
const path = require('path');
const targz = require('targz');
const ZlibConstants = require('zlib').constants;

class TmpFileStore {

    constructor() {
        this.ZONE = 'Europe/Warsaw';

        this.tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'ksgmet-downloader-'));

        log.info('Store constructed. Tmp directory: ' +
            this.tmpDir);
    }

    saveString(subPath, name, bodyString) {
        return this.save(subPath, name, bodyString, true);
    }

    save(subPath, name, body, isString = false) {
        log.debug(`Saving ${name} to ${subPath}`);

        const destDirPath = path.join(this.tmpDir, subPath);

        return new Promise((resolve, reject) => {
            log.debug('Creating directory: ' + destDirPath);
            mkdirRec.mkdir(destDirPath, err => {
                if (err) {
                    if (fs.existsSync(destDirPath)) {
                        log.debug('Directory already exists, continuing');
                    } else {
                        reject(err);
                    }
                }   
                
                this._saveFile(destDirPath, subPath, name, body, isString)
                    .then(fileName => resolve(fileName))
                    .catch(err => reject(err));
            });
        });
    }

    _saveFile(destDirPath, subPath, name, body, isString) {
        return new Promise((resolve, reject) => {
            const destFilePath = path.join(destDirPath, name);
            const dest = fs.createWriteStream(destFilePath);
            
            log.debug(`Destination for ${name}: ${destFilePath}`);

            if (isString) {
                dest.write(body, err => {
                    if (err) reject(err);
                    resolve(destFilePath);
                });
            } else {
                body.pipe(dest);
                body.on('error', err => {
                    reject(err);
                });
            }   

            dest.on('finish', () => {
                log.debug(`Saved ${name} to ${subPath}`);
                resolve(destFilePath);
            });
            dest.on('error', err => {
                reject(err);
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

            log.info('Creating tar: ' + filePath);

            targz.compress({
                src: this.tmpDir,
                dest: filePath,
                gz: {
                    level: ZlibConstants.Z_BEST_COMPRESSION 
                }
            }, err => {
                if (err) reject(err);

                log.info('Tar saved: ' + filePath);
                resolve(filePath);
            })
        });
    }
}

module.exports = TmpFileStore;
