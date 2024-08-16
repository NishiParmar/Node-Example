const createHttpError = require('http-errors')
const { getUserGroup } = require('../controllers/admin')
const { ROLES } = require('../utils/codeConstants')

async function verifyAdminRole(req, res, next) {
    try {
        const userGroup = await getUserGroup(req?.user)
        if (userGroup != ROLES.ADMIN) throw new createHttpError[403]('You are not authorized to access the request!')
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = verifyAdminRole