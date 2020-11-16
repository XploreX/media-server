function getSuccessResponse(data) {
    let response = {
        success : true
    };
    if(data) {
        response.data = data;
    }
    return data;
}

module.exports = {
    getSuccessResponse : getSuccessResponse
}