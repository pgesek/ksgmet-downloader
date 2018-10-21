const HtmlListing = require('../../src/page/html_listing.js');
const fs = require('fs');

describe('page parser', () => {
    it('should get content of last href', done => {
        fs.readFile("spec/test-data/listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toEqual('12');

            done();
        });
    });

    it('should only consider numeric hrefs', done => {
        fs.readFile("spec/test-data/listing_with_current.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toEqual('10');

            done();
        });
    });

    it('should return empty for empty listing', done => {
        fs.readFile("spec/test-data/empty_listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getLastNumericHrefVal()).toBeFalsy();

            done();
        });
    });

    it('should return all non special file names', done => {
        fs.readFile("spec/test-data/file_listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const fileNames = [
                'ACM_CONVECTIVE_PERCIP.csv',
                'ACM_CONVECTIVE_PERCIP.csv.jpg',
                'ACM_CONVECTIVE_PERCIP_LOCAL_MAX.csv'
            ];

            const listing = new HtmlListing(data);
            expect(listing.getAllFileNames()).toEqual(fileNames);

            done();
        });
    });

    it('should return null as first for empty listing', done => {
        fs.readFile("spec/test-data/empty_listing.html", "utf8", (err, data) => {
            if (err) throw err;
  
            const listing = new HtmlListing(data);
            expect(listing.getFirstFileName()).toBeNull();

            done();
        });
    });

    it('should return first file names', done => {
        fs.readFile("spec/test-data/file_listing.html", "utf8", (err, data) => {
            if (err) throw err;

            const listing = new HtmlListing(data);
            expect(listing.getFirstFileName())
                .toEqual('ACM_CONVECTIVE_PERCIP.csv');

            done();
        });
    });
});