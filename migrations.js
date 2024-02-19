import sqlite3 from 'sqlite3';

const dbName = 'db.sqlite';

const SQLQueries = {
    client: `
    CREATE TABLE IF NOT EXISTS client
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT '',
    phone_number TEXT NOT NULL DEFAULT ''
    )
    `,
    equipment: `
    CREATE TABLE IF NOT EXISTS equipment
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(client_id) REFERENCES client(id)
    )
    `,
    repair: `
    CREATE TABLE IF NOT EXISTS repair
    (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    equipment_id INTEGER NOT NULL,
    repair_type TEXT NOT NULL DEFAULT '',
    receiving_date TEXT NOT NULL, 
    issue_date TEXT, 
    repaired INTEGER NOT NULL DEFAULT 0, 
    price NUMBER NOT NULL DEFAULT 0, 
    img TEXT NOT NULL UNIQUE,
    FOREIGN KEY(equipment_id) REFERENCES equipment(id)
    )
    `,
};

const db = new sqlite3.Database(dbName);

Object.entries(SQLQueries).forEach(async ([name, SQLQuery]) => {
    try {
        console.log('\x1b[34m', name);
        db.run(SQLQuery);
        console.log('\x1b[32m', 'completed');
        console.log('\x1b[0m', '');
    } catch (e) {
        console.log('\x1b[31m', 'error:' + e);
    }
});
db.close();
console.log('\x1b[32m', 'FULL COMPLETED');
console.log('\x1b[0m', '');
