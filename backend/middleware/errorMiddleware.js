const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log the error for server-side debugging
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code: statusCode,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
