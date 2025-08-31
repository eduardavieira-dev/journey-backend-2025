/**
 * Valida se o ID é um número inteiro positivo
 * @param {any} id - O ID a ser validado
 * @returns {boolean} - true se for um ID válido, false caso contrário
 */
function isValidId(id) {
    if (id === null || id === undefined) {
        return false;
    }

    const num = Number(id);
    return Number.isInteger(num) && num > 0;
}

module.exports = {
    isValidId
};
