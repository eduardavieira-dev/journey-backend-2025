const {v4 : uuidv4} = require('uuid');

let agentes = [
    {
        id: "550e8400-e29b-41d4-a716-446655440001",
        nome: 'Agente Um',
        dataDeIncorporacao: '2022-01-15',
        cargo: 'supervisor'
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440002",
        nome: 'Agente Dois',
        dataDeIncorporacao: '2023-03-10',
        cargo: 'analista'
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440003",
        nome: 'Agente Três',
        dataDeIncorporacao: '2021-05-20',
        cargo: 'delegado'
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440004",
        nome: 'Agente Quatro',
        dataDeIncorporacao: '2024-02-08',
        cargo: 'investigador'
    }
];

const findAll = () => {
    return agentes; 
}

const findById = (id) => {
    return agentes.find(agente => agente.id === id);
}

const create = (data) => {
    const novoAgente = {
        id: uuidv4(),
        ...data
    };
    agentes.push(novoAgente);
    return novoAgente;
}

const update = (id, data) => {
    const index = agentes.findIndex(a => a.id === id);
    if (index === -1) return null;

    const agenteAtual = agentes[index];
    
    // Cria um novo objeto com os dados atualizados
    const agenteAtualizado = {
        id: agenteAtual.id,
        nome: data.nome !== undefined ? data.nome : agenteAtual.nome,
        dataDeIncorporacao: data.dataDeIncorporacao !== undefined ? data.dataDeIncorporacao : agenteAtual.dataDeIncorporacao,
        cargo: data.cargo !== undefined ? data.cargo.toLowerCase() : agenteAtual.cargo
    };

    // Verifica se todos os campos obrigatórios estão presentes
    if (!agenteAtualizado.nome || !agenteAtualizado.dataDeIncorporacao || !agenteAtualizado.cargo) {
        return null;
    }

    // Substitui o objeto antigo pelo novo
    agentes[index] = agenteAtualizado;
    return agenteAtualizado;
};

const remove = (id) =>{
    const agenteIndex = agentes.findIndex(agente => agente.id === id);
    if (agenteIndex === -1) return null;

    const [deletedAgente] = agentes.splice(agenteIndex, 1);
    return deletedAgente;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};