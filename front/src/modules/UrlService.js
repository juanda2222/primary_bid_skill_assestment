import axios from "axios"


const server_url = "http://localhost:5000/api/shorturl/"

class UrlService {

    // get the list of urls from the database
    static getUrls = async () => {
        
        const res = await axios.get(server_url)
        const data = res.data
        
        return data.map((post_item) => ({
            ...post_item,
            createdAt: new Date(post_item.createdAt)
        }))
    
    }

    // get a new url (and add it to the database)
    static createNewUrl = async (url) => {
        const data = {
            url:url
        }
        await axios.post(server_url, data)
    }

    // delete a url from id
    static deleteNewUrl = async (url_doc_id) => {
        await axios.delete(`${server_url}${url_doc_id}`)
    }
}

export default UrlService