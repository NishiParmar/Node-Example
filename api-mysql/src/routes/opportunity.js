const express = require('express')
const router = express.Router()
const { list, findOne, create, getOppCost, getReductionData, convert, update, opportunityLocations } = require('../controllers/opportunity')
const { list: getCaseImpactList } = require('../controllers/caseImpact')

router.post('/create', async (req, res, next) => {
    try {
        const opportunity = await create(req.body)

        return res.status(201).json(opportunity)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const opportunities = await list(req.body.business_id, req.user)

        return res.json(opportunities)
    } catch (error) {
        next(error)
    }
})
router.post('/cost', async (req, res, next) => {
    try {
        const opportunities = await getOppCost(req.body)

        return res.json(opportunities)
    } catch (error) {
        next(error)
    }
})

router.post('/reductions', async (req, res, next) => {
    try {
        const opportunities = await getReductionData(req.body.opportunityId)

        return res.json(opportunities)
    } catch (error) {
        next(error)
    }
})

router.get('/reductions/:opportunityId', async (req, res, next) => {
    try {
        const opportunities = await getCaseImpactList(req.params.opportunityId, req.query.scopes)

        return res.json(opportunities)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const opportunity = await findOne(req.params.id, req.user)

        return res.json(opportunity)
    } catch (error) {
        next(error)
    }
})

router.post('/convert/:id', async (req, res, next) => {
    try {
        const project = await convert(req.params.id, req.body)

        return res.json(project)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const opportunity = await update(query, req.body)

        return res.json(opportunity)
    } catch (error) {
        next(error)
    }
})

router.get('/locations/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const locations = await opportunityLocations(query)

        return res.json(locations)
    } catch (error) {
        next(error)
    }
})

module.exports = router
