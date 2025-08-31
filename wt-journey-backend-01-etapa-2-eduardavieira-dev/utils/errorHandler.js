const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    if (err.name === 'ZodError') {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Dados inválidos.',
            errors: err.errors
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor.';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};

module.exports = errorHandler;