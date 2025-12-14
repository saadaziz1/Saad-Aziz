const buildPagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { skip, limit, page };
};

const totalPages = (total, limit) => {
  return Math.ceil(total / limit);
};

module.exports = { buildPagination, totalPages };