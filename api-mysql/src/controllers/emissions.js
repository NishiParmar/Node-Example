const createHttpError = require('http-errors')
const db = require('../models')
const { getPermittedDataArrays } = require('./userPermission')

async function list(userDetails, businessId) {
    const { businessArray: allowedBusinesses } = await getPermittedDataArrays(userDetails, ['businesses'])
    if (!allowedBusinesses?.includes(parseInt(businessId))) throw new createHttpError[400]('you dont have necessary permissions for this action!')
    const emissionList = await db.emission.findAll({ where: { business_id: { [db.Sequelize.Op.or]: [businessId, null] } } })

    return emissionList
}

async function findOne(emissionId) {
    const emission = await db.emission.findByPk(emissionId, {
        include: [{
            model: db.emissionsFactor,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        }],
        order: [
            [db.emissionsFactor, 'start_date', 'ASC']
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    })

    if (!emission) {
        throw new createHttpError[404]('emission not found.')
    }

    return emission
}

module.exports = { list, findOne }