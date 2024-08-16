/**
 * responseHandler.js
 * @description :: exports all handlers for response format.
 */
const responseBody = require('../utils/response/index')
const responseCode = require('../utils/response/responseCode')

/**
 *
 * @param {obj} req : request from controller.
 * @param {obj} res : response from controller.
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req, res, next) => {
  res.success = (data = {}) => {
    res.status(responseCode.success).json(responseBody.success(data))
  }
  res.failure = (data = {}) => {
    res.status(responseCode.success).json(responseBody.failure(data))
  }
  res.internalServerError = (data = {}) => {
    res.status(responseCode.internalServerError).json(responseBody.internalServerError(data))
  }
  res.badRequest = (data = {}) => {
    res.status(responseCode.badRequest).json(responseBody.badRequest(data))
  }
  res.recordNotFound = (data = {}) => {
    res.status(responseCode.notFound).json(responseBody.recordNotFound(data))
  }
  res.validationError = (data = {}) => {
    res.status(responseCode.validationError).json(responseBody.validationError(data))
  }
  res.unAuthorized = (data = {}) => {
    res.status(responseCode.unAuthorized).json(responseBody.unAuthorized(data))
  }
  res.forbidden = (data = {}) => {
    res.status(responseCode.forbidden).json(responseBody.forbidden(data))
  }
  next()
}

module.exports = responseHandler