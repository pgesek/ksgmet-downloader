const del = require('del');
const fs = require('fs');
const log = require('../util/log.js');
const mkdirRec = require('mkdir-recursive');
const os = require('os');
const path = require('path');
const targz = require('targz');
const ZlibConstants = require('zlib').constants;

const TEMP_PREFIX = 'ksgmet-downloader-';

class TmpFileStore {

    constructor() {
        this.tmpDir = fs.mkdtempSync(path.join(
            os.tmpdir(), TEMP_PREFIX));

        log.info('Store constructed. Tmp directory: ' +
            this.tmpDir);
    }

    ensureDirStructure(subPath) {
        log.debug('Ensuring directory structure for: ' + subPath);
        const destDirPath = path.join(this.tmpDir, subPath);

        return new Promise((resolve, reject) => {
            if (fs.existsSync(destDirPath)) {
                log.debug('Directory already exists: ' + destDirPath);
                resolve(destDirPath);
            } else {
                log.debug('Creating directory: ' + destDirPath);
                mkdirRec.mkdir(destDirPath, err => {
                    if (err) reject(err);

                    log.debug('Directory created: ' + destDirPath);
                    resolve(destDirPath);
                });
            }
        });
    }

    saveString(subPath, name, bodyString) {
        return this.save(subPath, name, bodyString, true);
    }

    save(subPath, name, body, isString = false) {
        log.debug(`Saving ${name} to ${subPath}`);

        const destDirPath = path.join(this.tmpDir, subPath);

        return new Promise((resolve, reject) => {
            this._saveFile(destDirPath, subPath, name, body, isString)
                .then(fileName => resolve(fileName))
                .catch(err => reject(err));
        });
    }

    _saveFile(destDirPath, subPath, name, body, isString) {
        return new Promise((resolve, reject) => {
            const destFilePath = path.join(destDirPath, name);
            const dest = fs.createWriteStream(destFilePath);
            
            log.debug(`Destination for ${name}: ${destFilePath}`);

            if (isString) {
                dest.write(body, err => {
                    if (err) {
                        dest.end();
                        reject(err);
                    }
                    
                    dest.end();
                    resolve(destFilePath);
                });
            } else {
                body.pipe(dest);
                body.on('error', err => {
                    dest.end();
                    reject(err);
                });
            }   

            dest.on('finish', () => {
                log.debug(`Saved ${name} to ${subPath}`);
                dest.end();
                resolve(destFilePath);
            });
            dest.on('error', err => {
                dest.end();
                reject(err);
            });
        });
    }

    tarStore(fileName) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(os.tmpdir(), fileName);

            log.info('Creating tar: ' + filePath);

            targz.compress({
                src: this.tmpDir,
                dest: filePath,
                gz: {
                    level: ZlibConstants.Z_DEFAULT_COMPRESSION
                }
            }, err => {
                if (err) reject(err);

                log.info('Tar saved: ' + filePath);
                resolve(filePath);
            })
        });
    }

    clearStore() {
        return new Promise((resolve, reject) => {
            log.info('Clearing store: ' + this.tmpDir);
            del([this.tmpDir], { force: true }).then(() => {
                log.info('Store cleared');

                this.tmpDir = fs.mkdtempSync(path.join(
                    os.tmpdir(), TEMP_PREFIX));

                log.debug('Recreating temp dir: ' + this.tmpDir);

                resolve();
            }).catch(err => reject(err));
        });
    }
}

module.exports = TmpFileStore;
