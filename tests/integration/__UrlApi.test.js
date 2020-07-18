
const fs = require("fs")
const path = require("path")
const axios = require("axios");
const UrlService = require("../../front/src/modules/UrlService.js")
//jest.mock('../../front/src/modules/UrlService.js'); // SoundPlayer is now a mock constructor

//var babel = require("@babel/core"); // use babel to convert all the ES6 writen modules from vue

describe("Testing the shortUrl api integration", () => {

    // convert the file to commonjs with babel
    const module_path = path.normalize(__dirname+"../../front/src/modules/UrlService.js")
    //babel.transformFile(module_path, function(err, result) {
    //    console.log(result); // => { code, map, ast }
    //});
    console.log(process.env.test)
    const url = "http://localhost:5000/api/shorturl"

    
    test("This should get the url lists using http requests", async () => {
        
        /*
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
        */
    });
    
}); 