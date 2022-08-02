exports.handleNotFoundRoutes = (request, response, next) => {

  response.status(404).json({
    error: {
      message: 'Requesting api route is not available.'
    }
  })

};