import sqlite3 from 'sqlite3';
declare class Database {
    private db;
    constructor();
    private initializeTables;
    private insertSampleData;
    getDb(): sqlite3.Database;
    close(): void;
}
declare const _default: Database;
export default _default;
//# sourceMappingURL=database.d.ts.map