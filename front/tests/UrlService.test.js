
/**
 * @jest-environment node
 */

 //execute with yarn test UrkService.test.js

const fs = require("fs")
const path = require("path")
const UrlService = require("../../front/src/modules/UrlService.js")


describe("Testing the shortUrl api integration", () => {

    // convert the file to commonjs with babel
    const url = "http://localhost:5000/api/shorturl"

    test("This should get the url lists using http requests", async () => {
        
        const urls = await UrlService.getUrls()
        console.log(urls)
        expect(urls.length).toBeGreaterThan(0)
        
    });

    test("This should insert and delete a entry using the api", async () => {
        
        const urls = await UrlService.getUrls()
        console.log(urls)
        expect(urls.length).toBeGreaterThan(0)
        
    });
    
}); 