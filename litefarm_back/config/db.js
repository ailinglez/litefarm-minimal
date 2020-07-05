require('dotenv').config();
const {DB_NAME, DB_PORT, DB_HOST, DB_USER, DB_PASSWORD} = process.env;
module.exports = {
    client: 'pg',
    connection: {
        host : DB_HOST,
        port: DB_PORT,
        user : DB_USER,
        password : DB_PASSWORD,
        database : DB_NAME
    },
}