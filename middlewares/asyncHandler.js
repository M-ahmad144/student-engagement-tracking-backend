// Middleware for handling asynchronous functions
module.exports = function asyncHandler(handler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
