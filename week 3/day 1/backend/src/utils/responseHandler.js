/**
 * Standard response handler for consistent API responses
 */

const sendResponse = (res, statusCode, success, data = null, message = '') => {
    const response = {
        success,
        message,
        data
    };
    
    // Remove null/undefined fields
    Object.keys(response).forEach(key => {
        if (response[key] === null || response[key] === undefined) {
            delete response[key];
        }
    });
    
    return res.status(statusCode).json(response);
};

const sendSuccess = (res, data = null, message = '', statusCode = 200) => {
    return sendResponse(res, statusCode, true, data, message);
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, data = null) => {
    return sendResponse(res, statusCode, false, data, message);
};

module.exports = {
    sendResponse,
    sendSuccess,
    sendError
};