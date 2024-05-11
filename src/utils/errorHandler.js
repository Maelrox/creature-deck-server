function handleError(error) {
  let response = {
    success: false,
    message: error.message,
  };
  return response;
}

export { handleError };
