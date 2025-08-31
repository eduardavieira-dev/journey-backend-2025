/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('agentes', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.date('dataDeIncorporacao').notNullable();
        table.string('cargo').notNullable();
    });

    await knex.schema.createTable('casos', function (table) {
        table.increments('id').primary();
        table.string('titulo').notNullable();
        table.text('descricao').notNullable();
        table.enum('status', ['aberto', 'solucionado']);
        table
            .integer('agente_id')
            .references('id')
            .inTable('agentes')
            .notNullable()
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('casos');
    await knex.schema.dropTableIfExists('agentes');
};
