
const fs = require("fs")
const path = require("path")
const axios = require("axios");
//const UrlService = require("../../front/src/modules/UrlService.js");

describe("Testing the shortUrl api integration", () => {

    const url = "http://localhost:5000/api/shorturl"

    test("This should get the url lists using http requests", async () => {
        
        async function get_urls() {
            return new Promise( async (resolve, reject) => {
                try {
                    const res = await axios.get(url)
                    const data = res.data
                    resolve(
                        data.map((post_item) =>({
                            ...post_item,
                            createdAt: new Date(post_item.createdAt)
                        }))
                    )
                } catch (error) {
                    reject(error)
                }
            })
        }
        
        const urls = await get_urls()
        console.log(urls)
        expect(urls.length).toBeGreaterThan(0)
    });
    
});