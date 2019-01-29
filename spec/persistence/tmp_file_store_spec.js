const TmpFileStore = require('../../src/persistence/tmp_file_store.js');
const fs = require('fs');

describe('tmp file store', () => {
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    it('should create a temp file', done => {
        const store = new TmpFileStore();
        const body = {
            pipe: dest => {
                dest.write('test content');
                dest.end();
            },
            on: (what, val) => {}
        };

        store.ensureDirStructure('1/2/3/').then(() => {
            store.save('1/2/3/', 'test.txt', body).then(file => {
                fs.readFile(file, 'utf8', function(err, data) {
                    if (err) throw err;
                    
                    expect(data).toEqual("test content");
                    
                    store.tarStore('ksgmet-test.tar.gz').then(tarPath => {
                        expect(fs.existsSync(tarPath)).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });

    it('should ensure a directory structure', async () => {
        const path = '3/2/11';
        const store = new TmpFileStore();
        
        let dirPath = await store.ensureDirStructure(path);
        expect(fs.existsSync(dirPath)).toBeTruthy();

        dirPath = await store.ensureDirStructure(path);
        expect(fs.existsSync(dirPath)).toBeTruthy();
    });

    it('should clear store', async () => {

        const path = '3/2/11';
        const store = new TmpFileStore();

        const dirPath = await store.ensureDirStructure(path);
        const filePath = await store.saveString('3/2/11/', 'test.txt', 'Test Content');
        
        await store.clearStore();
        expect(fs.existsSync(dirPath)).toBeFalsy();
        expect(fs.existsSync(filePath)).toBeFalsy();
    });
});