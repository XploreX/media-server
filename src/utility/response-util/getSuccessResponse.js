/**
 * returns a valid response
 * @param {string} data the data to be sent in response
 * @return {JSON} returns the response as {"success":true,"data":...}
 */
function getSuccessResponse(data) {
  const response = {
    success: true,
  };
  if (data) {
    response.data = data;
  }
  return response;
}

module.exports = getSuccessResponse;
