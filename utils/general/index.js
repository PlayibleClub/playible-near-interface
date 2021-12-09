import * as statusCode from '../../data/constants/status';

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

export const handleRequestResponse = (responseList, onSuccess, onFail) => {
  let hasFailed = false;
  responseList.forEach((response) => {
    if (response?.payload?.status === statusCode.ERROR ?? true) {
      hasFailed = true;
      if (typeof onFail === 'function') {
        onFail();
      } 
    }
  });

  if (!hasFailed) {
    if (onSuccess !== null) {
      onSuccess();
    }
  }
}