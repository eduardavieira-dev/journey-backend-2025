const {v4 : uuidv4} = require('uuid');

let casos = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "550e8400-e29b-41d4-a716-446655440001" 
    },
    {
        id: "a2c3e4f5-6789-4abc-bcde-1234567890ab",
        titulo: "roubo",
        descricao: "Assalto à mão armada em uma joalheria no centro da cidade, ocorrido em 15/03/2022.",
        status: "aberto",
        agente_id: "550e8400-e29b-41d4-a716-446655440002"
    },
    {
        id: "b3d4e5f6-7890-4bcd-cdef-2345678901bc",
        titulo: "furto",
        descricao: "Furto de veículo registrado no estacionamento do shopping em 20/08/2021.",
        status: "solucionado",
        agente_id: "550e8400-e29b-41d4-a716-446655440001"
    }
];

const findAll = () => {
    return casos;
}

const findById = (id) => {
    return casos.find(caso => caso.id === id);
}

const create = (data) => {
    const novoCaso = {
        id: uuidv4(),
        ...data
    };
    casos.push(novoCaso);
    return novoCaso;
}

const update = (id, data) => {
    const caso = casos.find(caso => caso.id === id);

    if (!caso) return null;

    // Atualiza apenas os campos que foram fornecidos
    caso.titulo = data.titulo !== undefined ? data.titulo : caso.titulo;
    caso.descricao = data.descricao !== undefined ? data.descricao : caso.descricao;
    caso.status = data.status !== undefined ? data.status : caso.status;
    caso.agente_id = data.agente_id !== undefined ? data.agente_id : caso.agente_id;

    return caso;
};

const remove = (id) => {
    const casoIndex = casos.findIndex(caso => caso.id === id);
    if (casoIndex === -1) return null;

    const [deletedCaso] = casos.splice(casoIndex, 1);
    return deletedCaso;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};