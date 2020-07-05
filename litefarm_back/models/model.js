const db = require('./../config/db');
const knex = require('knex')(db);
const types = require('pg').types;
types.setTypeParser(1700, (value) => { // to parse numerics
    return parseFloat(value);
});
class Model {

    constructor(tableName) {
        this.tableName = tableName;
    }

    retrieve(query = null, keys = ['*']) {
        if (query) {
            return knex.select(keys).from(this.tableName).where(query);
        } else {
            return knex().select().from(this.tableName);
        }
    }

    update(idQuery, body) {
        if (!idQuery || !body) {
            return Promise.reject();
        }
        return knex(this.tableName)
            .where(idQuery)
            .update(body,['*'])
    }

    insert(body, returning= ['*']) {
        if(!body) {
            return Promise.reject();
        }
        return knex(this.tableName)
            .insert(body, returning)
            .into(this.tableName)
    }
}

module.exports.Model = Model;