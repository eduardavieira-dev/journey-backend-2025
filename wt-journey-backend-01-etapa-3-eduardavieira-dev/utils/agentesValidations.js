const z = require('zod');
const { validate } = require('./errorHandler');

const newAgenteValidation = (req, res, next) => {
    const newAgente = z.object({
        body: z.object({
            nome: z.string({ error: 'O nome é obrigatório' }).min(1, 'O nome é obrigatório'),
            cargo: z.string({ error: 'O cargo é obrigatório' }).min(1, 'O cargo é obrigatório'),
            dataDeIncorporacao: z.iso
                .date({
                    error: (issue) =>
                        issue.input === undefined
                            ? 'A data de incorporação é obrigatória'
                            : 'A data de incorporação deve estar no formato YYYY-MM-DD',
                })
                .refine((value) => {
                    const now = new Date();
                    const inputDate = new Date(value);
                    return inputDate <= now;
                }, 'A data não pode estar no futuro'),
        }),
    });

    validate(newAgente, req);
    next();
};

const updateAgenteValidation = (req, res, next) => {
    const updateAgente = z.object({
        params: z.object({
            id: z.coerce
                .number({ error: 'Id inválido' })
                .int({ error: 'Id inválido' })
                .positive({ error: 'Id inválido' }),
        }),
        body: z
            .looseObject({
                nome: z.string({ error: 'O nome é obrigatório' }).min(1, 'O nome é obrigatório'),
                cargo: z.string({ error: 'O cargo é obrigatório' }).min(1, 'O cargo é obrigatório'),
                dataDeIncorporacao: z.iso
                    .date({
                        error: (issue) =>
                            issue.input === undefined
                                ? 'A data de incorporação é obrigatória'
                                : 'A data de incorporação deve estar no formato YYYY-MM-DD',
                    })
                    .refine((value) => {
                        const now = new Date();
                        const inputDate = new Date(value);
                        return inputDate <= now;
                    }, 'A data não pode estar no futuro'),
            })
            .refine((data) => data.id === undefined, {
                error: 'O id não pode ser atualizado',
            }),
    });

    validate(updateAgente, req);
    next();
};

const partialUpdateAgenteValidation = (req, res, next) => {
    const updateAgente = z.object({
        params: z.object({
            id: z.coerce
                .number({ error: 'Id inválido' })
                .int({ error: 'Id inválido' })
                .positive({ error: 'Id inválido' }),
        }),
        body: z
            .strictObject(
                {
                    nome: z.optional(z.string().min(1, 'O nome não pode ser vazio')),
                    cargo: z.optional(z.string().min(1, 'O cargo nã pode ser vazio')),
                    dataDeIncorporacao: z.optional(
                        z.iso
                            .date({
                                error: 'A data de incorporação deve estar no formato YYYY-MM-DD',
                            })
                            .refine((value) => {
                                const now = new Date();
                                const inputDate = new Date(value);
                                return inputDate <= now;
                            }, 'A data não pode estar no futuro')
                    ),
                },
                {
                    error: (err) => {
                        if (err.keys.length > 0) {
                            return `Alguns campos não são válidos para a entidade agente: ${err.keys.join(
                                ', '
                            )}`;
                        }
                        return err;
                    },
                }
            )
            .refine((data) => data.id === undefined, {
                error: 'O id não pode ser atualizado',
            }),
    });

    validate(updateAgente, req);
    next();
};

module.exports = {
    newAgenteValidation,
    updateAgenteValidation,
    partialUpdateAgenteValidation,
};
