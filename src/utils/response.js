function formatResponse(operationType, data) {
  return JSON.stringify({ type: operationType, data });
}

export default {
  formatResponse,
};
