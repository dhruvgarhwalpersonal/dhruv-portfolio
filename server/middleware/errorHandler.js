/**
 * Global error-handling middleware.
 * Mount AFTER all routes: app.use(errorHandler)
 */
module.exports = function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message || 'Internal server error',
  });
};
