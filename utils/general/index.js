export const checkResponseValidity = (response) => {
    if (response.status >= 300) {
      response.statusText = 'failed. An error has occurred';
      return { response, valid: false };
    }
    if (response.status >= 200) {
      if (response.data.length === 0) {
        response.statusText = 'successful. No data retrieved.';
        return { response, valid: true };
      }
      response.statusText = 'successful';
      return { response, valid: true };
    }
  
    response.statusText = 'failed. An error has occured';
    return { response, valid: false };
};