const fs = require('fs');
const os = require('os');
const path = require('path');
const mkdirRec = require('mkdir-recursive');
const targz = require('targz');
const moment = require('moment-timezone');
const ZlibConstants = require('zlib').constants;
class TmpFileStore {

    constructor() {
        this.ZONE = 'Europe/Warsaw';

        this.tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), 'ksgmet-downloader-'));

        console.log('Store constructed. Tmp directory: ' +
            this.tmpDir);
    }

    saveString(subPath, name, bodyString) {
        return this.save(subPath, name, bodyString, true);
    }

    save(subPath, name, body, isString = false) {
        console.log(`Saving ${name} to ${subPath}`);

        const destDirPath = path.join(this.tmpDir, subPath);

        if (fs.existsSync(destDirPath)) {
            return this._saveFile(destDirPath, subPath, name, body, 
                isString);
        } else {
            console.log('Creating directory: ' + destDirPath);
            return new Promise((resolve, reject) => {
                mkdirRec.mkdir(destDirPath, err => {
                    if (err) {
                        if (fs.existsSync(destDirPath)) {
                            console.log('Directory already exists, continuing')
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
    }

    _saveFile(destDirPath, subPath, name, body, isString) {
        return new Promise((resolve, reject) => {
            const destFilePath = path.join(destDirPath, name);
            const dest = fs.createWriteStream(destFilePath);
            
            console.log(`Destination for ${name}: ${destFilePath}`);

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
                console.log(`Saved ${name} to ${subPath}`);
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

            console.log('Creating tar: ' + filePath);

            targz.compress({
                src: this.tmpDir,
                dest: filePath,
                gz: {
                    level: ZlibConstants.Z_BEST_COMPRESSION 
                }
            }, err => {
                if (err) reject(err);

                console.log('Tar saved: ' + filePath);
                resolve(filePath);
            })
        });
    }
}

module.exports = TmpFileStore;
