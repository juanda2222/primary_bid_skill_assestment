import axios from "axios"


const server_url = "api/shorturl/"

class UrlService {

    // get the list of urls from the database
    static getUrls = async () => {
        
        const res = await axios.get(
            server_url, 
            {headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            }}
        )

        const data = {
            ...res.data,
            UrlList: res.data.UrlList.map((post_item) => ({
                ...post_item,
                createdAt: new Date(post_item.createdAt)
            }))
        }
        return data
    }

    // get the list of urls from the database
    static getUserUrls = async () => {
        
        const res = await axios.get(
            `${server_url}?byUser=true`, 
            {headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            }}
        )
        
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
        const created_entry = await axios.post(
            server_url, 
            data, 
            {headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            }}
        )
        return created_entry
    }

    // delete a url from id
    static deleteUrl = async (url_doc_id) => {
        const res = await axios.delete(`${server_url}${url_doc_id }`)
        return res
    }
}

export default UrlService