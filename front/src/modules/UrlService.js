import axios from "axios"


const url = "http://localhost:5000/api/shorturl"

class UrlService {

    // get the list of urls from the database
    static getUrls() {
        return new Promise( async (resolve, reject) => {
            try {
                const res = await axios.get(url)
                const data = res.data
                resolve(
                    data.map((post_item)={
                        ...post_item,
                        createdAt: new Date(post_item.createdAt)
                    })
                )
            } catch (error) {
                reject(error)
            }
        })
    }

    // get a new url (and add it to the database)

    // delete a url from id
}

module.exports = UrlService