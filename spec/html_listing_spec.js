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

    it('should only consider numeric hrefs', done => {
        fs.readFile("spec/data/listing_with_current.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toEqual('10');

            done();
        });
    });

    it('should return empty for empty listing', done => {
        fs.readFile("spec/data/empty_listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toBeFalsy();

            done();
        });
    });
});