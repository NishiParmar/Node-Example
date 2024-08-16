const createHttpError = require('http-errors')
const moment = require('moment')
const db = require('../models')
const { convertCsvToJson } = require('../helpers/convertToJson')
const { getPermissionData } = require('./userPermission')

async function list(payload) {
    const { business_id, sites, assets, resources } = payload
    if (!business_id) throw new createHttpError[422]('please provide valid business_id parameter!')

    const flowFilter = { business_id }
    if (sites?.length) flowFilter['site_id'] = { [db.Sequelize.Op.in]: sites }
    if (assets?.length) flowFilter['asset_id'] = { [db.Sequelize.Op.in]: assets }
    if (resources?.length) flowFilter['resource_id'] = { [db.Sequelize.Op.in]: resources }

    const flows = await db.FlowView.findAll({ where: flowFilter })

    return flows
}

async function findOne(flowId) {
    const flow = await db.flow.findByPk(flowId, {
        include: [{
            model: db.meter,
            include: [{
                model: db.resource
            }]
        }]
    })

    if (!flow) {
        throw new createHttpError[404]('flow not found.')
    }

    return flow
}

async function createFlowsFromFile(payload, businessId) {
    const file = payload?.flowFile
    const jsonData = await convertCsvToJson(file)
    const dbMappingObject = await db.setting.findOne({ where: { business_id: businessId, setting_name: 'mappings' }, raw: true })
    if (!dbMappingObject) throw new createHttpError[400]('mappings are not defined')
    const flowMapping = JSON.parse(dbMappingObject.value)
    const flowMappingKeys = Object.keys(flowMapping)
    const business = await db.business.findByPk(businessId)
    if (!business) throw new createHttpError[404]('business not found')

    let flows = []
    for (let obj of jsonData) {
        // const { ID, Category, Estimate, 'Date Type': date_type, 'Year Type': year_type } = obj
        const mappedObject = {}
        for (let property in obj) {
            if (flowMappingKeys.includes(property)) {
                let newProperty = flowMapping?.[property]
                mappedObject[newProperty] = obj[property]
            }
        }
        const { id, site_name, asset_name, value, cost, month, year, source_name, source_class, value_unit } = mappedObject

        const siteObject = { name: site_name, business_id: businessId }
        const [site] = await db.site.findOrCreate({ where: siteObject, defaults: siteObject, raw: true })

        const assetObject = { site_id: site?.id, name: asset_name }
        const [asset] = await db.asset.findOrCreate({ where: assetObject, defaults: assetObject, raw: true })

        const unitObject = { name: value_unit, is_base: 0 }
        const [unit] = await db.unit.findOrCreate({ where: unitObject, defaults: unitObject, raw: true })

        const resourceObject = { name: source_name, class: source_class, unit_id: unit?.id }
        const [resource] = await db.resource.findOrCreate({ where: resourceObject, defaults: resourceObject, raw: true })

        const meterObject = { resource_id: resource?.id }
        const [meter] = await db.meter.findOrCreate({ where: meterObject, defaults: meterObject, raw: true })

        const assetMeterObject = { asset_id: asset?.id, meter_id: meter?.id }
        await db.assetMeter.findOrCreate({ where: assetMeterObject, defaults: assetMeterObject, raw: true })

        const start_date = moment(`${year}-${month}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD')
        const end_date = moment(start_date, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
        const flowObject = { value, cost, meter_id: meter?.id, start_date, end_date }
        let flow
        if (id) {
            await db.flow.update(flowObject, { where: { id } })
            flow = await db.flow.findByPk(id, { raw: true })
        } else {
            [flow] = await db.flow.findOrCreate({ where: flowObject, defaults: flowObject, raw: true })
        }
        flows.push(flow)

        const businessResourceObject = { business_id: businessId, resource_id: resource?.id, preferred_unit: value_unit }
        await db.businessResource.findOrCreate({ where: businessResourceObject, defaults: businessResourceObject, raw: true })
    }

    return flows
}

async function update(query, payload) {
    const flow = await db.flow.update(payload, { where: query })

    return flow
}

async function create(userDetails, payload) {
    const { business_id: businessId, resource_id, month, year, flows } = payload
    if (!businessId || !resource_id || !month || !year) throw new createHttpError[422]('please provide valid parameters!')
    const { businesses: permittedBusinesses } = await getPermissionData(userDetails, 'businesses', null, 'permittedBusinessesArray')
    if (!permittedBusinesses.includes(parseInt(businessId))) throw new createHttpError[403]('you are not allowed to perform this action!')
    const resourceFilter = { id: resource_id, business_id: businessId }
    const resource = await db.resource.findOne({ where: resourceFilter })
    if (!resource) throw new createHttpError[404]('resource not found with this business!')
    const { unit_id, preferred_unit } = resource
    const unitConversionFilter = { unit_from_id: unit_id, unit_to_id: preferred_unit }
    const unitConversion = await db.unitConversion.findOne({ where: unitConversionFilter, raw: true })
    const multiplier = unitConversion.multiplier || 1
    const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').format('YYYY-MM-DD')
    const endDate = moment(startDate, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')

    const flowArray = [], meterArr = []
    for (let flowObj of flows) {
        const { meter_id, value, cost } = flowObj

        if (meterArr.includes(meter_id)) throw new createHttpError[422]('can\'t add flow values for same meter multiple times in same month!')
        meterArr.push(meter_id)
        const meterFilter = { id: meter_id, resource_id }
        const meter = await db.meter.findOne({ where: meterFilter, raw: true })
        if (!meter) throw new createHttpError[404]('resource not found with associated meter!')

        const baseValue = value / multiplier || 0
        const flowObject = { value: baseValue, cost, meter_id, start_date: startDate, end_date: endDate }
        flowArray.push(flowObject)
    }
    const flow = await db.flow.bulkCreate(flowArray)

    return flow
}

module.exports = { list, findOne, create, createFlowsFromFile, update }
