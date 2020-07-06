const db = require('./config/db');
const knex = require('knex')(db);

const action = process.argv[2] === 'reset' ? 'reset' : 'init';

async function reset(){
    await knex.schema.dropTableIfExists('field');
    await knex.schema.dropTableIfExists('farm');
    await knex.schema.dropTableIfExists('farmer');
}

async function create() {
    await knex.schema.createTable('farmer', (table) => {
        table.increments();
        table.string('password', 128).notNullable();
        table.string('email').unique().notNullable();
        table.string('name');
        table.string('salt', 32).notNullable();
    }).createTable('farm', (table) => {
        table.increments();
        table.integer('farmer_id').unsigned().notNullable();
        table.string('name').notNullable();
        table.decimal('total_area', 16, 2);
        table.string('address_id').notNullable();
        table.string('address_name');
        table.integer('measure_system', 1).notNullable();
        table.foreign('farmer_id').references('id').inTable('farmer');
    }).createTable('field', (table) => {
        table.increments();
        table.string('name').notNullable();
        table.integer('farm_id').unsigned().notNullable();
        table.decimal('total_area', 16, 2);
        table.specificType('points', 'jsonb');
        table.foreign('farm_id').references('id').inTable('farm');
    });
}

async function restartDB() {
    if( action === 'reset') {
        await reset();
    }
    await create().catch(() => {
        console.log('You have existing tables, if you wish to overwrite them, try reset option')
    });
    console.log('Finished DB setup');
    knex.destroy();
}

restartDB();