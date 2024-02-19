import XLSX from 'xlsx';
import sqlite3 from 'sqlite3';

const dbName = 'db.sqlite';
const workbook = XLSX.readFile('db.xls');

const TABLE_TYPE = {
    EQUIPMENT: 0, CLIENT: 1, REPAIR: 2,
}
// const KEY_NAME_MAP = {
//     'Имя': 'name',
//     'Номер телефона': "phone_number",
//     'ТипРемонта': 'repair_type',
//     'Дата получения': 'receiving_date',
//     'Дата выдачи': 'issue_date',
//     'СтатусРемонта': 'repaired',
//     'Цена': 'price',
//     'Наименование оборудования': 'equipment_name',
// }
//
// const TABLE_NAME_MAP = {
//     'Оборудоваие': 'equipment', 'Клиенты': 'client', 'Ремонт': 'repair',
// }


var sheet_name_list = workbook.SheetNames;
console.log(sheet_name_list);
const db = new sqlite3.Database(dbName);
const readDataFromSheet = (sheetItem, type) => {
    var worksheet = workbook.Sheets[sheetItem];
    var headers = {};
    var data = [];
    for (let z in worksheet) {
        if (z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        }
        var col = z.substring(0, tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    console.log("data");
    console.log(data);
    data.forEach(item => {
        let query
        switch (type) {
            case TABLE_TYPE.CLIENT:
                query = `INSERT INTO client (name, phone_number) VALUES('${item['Имя']}', '${item['Номер телефона']}');`
                break
            case TABLE_TYPE.EQUIPMENT:
                console.log(item);
                const sqlFindClientId = `SELECT id FROM client WHERE name = '${item['Имя']}'`
                console.log("sqlFindClientId");
                console.log(sqlFindClientId);
                db.get(sqlFindClientId, (error, data) => {
                    console.log('data');
                    console.log(data);
                    query = `INSERT INTO client (client_id, name) VALUES('${data.id}', '${item['Наименование оборудования']}');`
                    db.run(query);
                })
                break
            case TABLE_TYPE.REPAIR:
                query = `INSERT INTO client (name, phone_number) VALUES('${item['Имя']}', '${item['Номер телефона']}');`
                console.log(item);
                const sqlFindEquipmentId = `SELECT id FROM equipment WHERE name = '${item['Имя']}'`
                console.log("sqlFindEquipmentId");
                console.log(sqlFindEquipmentId);
                db.get(sqlFindEquipmentId, (error, data) => {
                    console.log('data');
                    console.log(data);
                    query = `INSERT INTO client (equipment_id, repair_type, receiving_date, issue_date, repaired, price) VALUES('${data.id}', '${item['ТипРемонта']}', '${item['Дата получения']}', '${item['Дата выдачи']}', '${item['СтатусРемонта']}', '${item['Цена']}');`
                    db.run(query);
                })
                break
            default:
                query = ''
        }
    })
    db.close();
}


readDataFromSheet(sheet_name_list[TABLE_TYPE.CLIENT], TABLE_TYPE.CLIENT)
readDataFromSheet(sheet_name_list[TABLE_TYPE.EQUIPMENT], TABLE_TYPE.EQUIPMENT)
readDataFromSheet(sheet_name_list[TABLE_TYPE.REPAIR], TABLE_TYPE.REPAIR)