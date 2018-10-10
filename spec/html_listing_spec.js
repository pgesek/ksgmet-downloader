const HtmlListing = require('../src/page/html_listing.js');
const fs = require('fs');

describe('page parser', () => {
    it('should get content of last href', done => {
        fs.readFile("spec/data/listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toEqual('12');

            done();
        });
    });

    it('should return undefined for empty listing', done => {
        fs.readFile("spec/data/empty_listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toBeUndefined();

            done();
        });
    });
});