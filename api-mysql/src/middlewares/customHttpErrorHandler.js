const { create: saveErrorLog } = require('../controllers/logs')
const getDataFromObject = require('../utils/getDataFromObject')

module.exports = function customHttpErrorHandler(err, req, res, next) {
    // log error in database
    saveErrorLog({ message: err.message })

    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'develop' ? err : {}
    if (err && err.response) {

        console.log('Response Status: ', err.response.status)
        console.log('URL: ', err.config.url)

        const message = getDataFromObject(err.response.data, 'error_messages.base.message')
        let errorObj = { message: err.response.message, data: err.response.data }
        if (message) { errorObj.message = message }
        switch (err.response.status) {
            case 401:
                return res.unAuthorized(errorObj)
            case 400:
                return res.badRequest(errorObj)
            case 403:
                return res.forbidden(errorObj)
            case 404:
                return res.recordNotFound(errorObj)
            case 422:
                return res.validationError(errorObj)
            default:
                return res.internalServerError(errorObj)
        }
    } else if (err && err.status && err.message) {
        console.log('Error: ', err.message)

        return res.status(err.status).json({ message: err.message })
    } else if (err && err.name == 'SequelizeUniqueConstraintError') {
        console.log('Error: ', err.name)

        return res.status(422).json({ message: 'Validation Error!' })
    } else {
        console.log('Error: ', err.message, err.stack)

        return res.internalServerError({ message: err.message, data: {} })
    }
}
