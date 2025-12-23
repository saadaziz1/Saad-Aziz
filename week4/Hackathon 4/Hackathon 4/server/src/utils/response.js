const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

const sendSuccess = (res, message, data = null) => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

module.exports = { sendResponse, sendError, sendSuccess };