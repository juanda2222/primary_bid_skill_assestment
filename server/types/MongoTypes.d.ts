interface Client {
    connect(callback: Function): void;
    db(database_name: string): any;
    close(): void;
}
export { Client };
