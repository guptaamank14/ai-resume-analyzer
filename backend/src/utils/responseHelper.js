const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, message = 'Error occurred', statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

const sendPaginated = (res, data, page, limit, total, message = 'Paginated data retrieved') => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: parseInt(page),
      limit: parseInt(limit),
      totalItems: total,
      totalPages
    }
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated
};
