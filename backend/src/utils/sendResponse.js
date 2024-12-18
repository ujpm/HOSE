const sendResponse = (res, statusCode, success, data, message = null) => {
    const response = {
        success,
        data
    };

    if (message) {
        response.message = message;
    }

    res.status(statusCode).json(response);
};

export default sendResponse;
