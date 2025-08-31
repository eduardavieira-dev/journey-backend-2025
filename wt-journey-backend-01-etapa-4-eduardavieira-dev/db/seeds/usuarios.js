/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('usuarios').del();
    await knex('usuarios').insert([
        {
            nome: 'Admin',
            email: 'admin@email.com',
            senha: '$2a$10$UJVgpxS6.op9EOhGwL7FDusVXfB5vYKA2K07C9yW88F5L2zdiVvMq' // senha: Admin@123
        },
        {
            nome: 'Usuario Teste',
            email: 'usuario@email.com',
            senha: '$2a$10$WVaOFA7niYgWGZ6YSOlIt.lX9nbo7kd7YeKuVm9L1Z4JSNQlObCBm' // senha: Teste@123
        }
    ]);
};
