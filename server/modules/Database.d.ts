interface UrlDbObject {
    _id: string;
    urlId?: string;
    url?: string;
    userId?: string;
    createdAt?: Date;
    short_url?: string;
}
declare class Database {
    _uri: string;
    constructor(user: string, password: string);
    isConnected(): any;
    connect(): Promise<unknown>;
    close(): Promise<void>;
    create_url_entry(userId: string, urlId: string, url: string): Promise<{
        ops: UrlDbObject[];
    }>;
    delete_url_entry(doc_id: string): Promise<{
        deletedCount: number;
    }>;
    get_all_urls(maximumNumberOfResults: number): Promise<UrlDbObject[]>;
    get_urls_by_user_id(user_id: string | undefined, maximumNumberOfResults: number): Promise<UrlDbObject[]>;
}
export default Database;
