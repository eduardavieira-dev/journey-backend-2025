class AppError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors.map((err) => err.msg || err);
    }
}

const validate = (schema, req) => {
    const result = schema.safeParse(req);

    if (!result.success) {
        const errors = JSON.parse(result.error).map((err) => err.message);
        throw new AppError(400, 'Parâmetros inválidos', errors || []);
    }
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor';
    const errors = err.errors || [];

    res.status(statusCode).json({
        status: statusCode,
        message,
        errors,
    });
};

module.exports = {
    errorHandler,
    validate,
    AppError,
};
