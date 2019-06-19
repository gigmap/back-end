const formatResponseError = (code, data) => {
  const message = {code};
  if (data) {
    Object.assign(message, {...data});
  }

  return {errors: [message]};
};

module.exports = formatResponseError;