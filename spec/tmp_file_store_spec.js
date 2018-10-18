const TmpFileStore = require('../src/persistence/tmp_file_store.js');
const os = require('os');
const path = require('path');
const fs = require('fs');

describe('tmp file store', () => {
    it('should create a temp file', done => {
        const store = new TmpFileStore();
        const body = {
            pipe: dest => {
                dest.write('test content');
                dest.end();
            },
            on: (what, val) => {}
        };

        store.save('1/2/3/', 'test.txt', body).then(file => {
            fs.readFile(file, 'utf8', function(err, data) {
                if (err) throw err;
                
                expect(data).toEqual("test content");
                
                store.tarStore().then(tarPath => {
                    expect(fs.existsSync(tarPath)).toBeTruthy();
                    done();
                });
            });
        });
    });
});