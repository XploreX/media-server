function getSuccessResponse(data) {
    let response = {
        success : true
    };
    if(data) {
        response.data = data;
    }
    return response;
}

module.exports = {
    getSuccessResponse : getSuccessResponse
}