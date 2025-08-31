/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('casos').del();
    await knex('casos').insert([
        {
            titulo: 'homicidio',
            descricao:
                'Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.',
            status: 'aberto',
            agente_id: 3,
        },
        {
            titulo: 'roubo à mão armada',
            descricao:
                'Na madrugada de 15/03/2019, dois suspeitos armados invadiram uma loja de conveniência na Av. Brasil, levando cerca de R$ 12.000,00 em dinheiro.',
            status: 'aberto',
            agente_id: 2,
        },
        {
            titulo: 'tráfico de drogas',
            descricao:
                'Após denúncia anônima, agentes localizaram um ponto de venda de drogas na comunidade do Morro Azul, apreendendo entorpecentes e prendendo dois indivíduos.',
            status: 'solucionado',
            agente_id: 1,
        },
    ]);
};
