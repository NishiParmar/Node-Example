const express = require('express')
const router = express.Router()
const { list, findOne, create, update, getProjectCosts, getReductionData } = require('../controllers/projects')
const { list: getImpactList } = require('../controllers/impact')

router.post('/create', async (req, res, next) => {
    try {
        const project = await create(req.body)

        return res.status(201).json(project)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const projects = await list(req.body.business_id, req.user)

        return res.json(projects)
    } catch (error) {
        next(error)
    }
})
router.post('/cost', async (req, res, next) => {
    try {
        const projects = await getProjectCosts(req.body.projectId)

        return res.json(projects)
    } catch (error) {
        next(error)
    }
})
router.post('/reductions', async (req, res, next) => {
    try {
        const projects = await getReductionData(req.body.projectId)

        return res.json(projects)
    } catch (error) {
        next(error)
    }
})
router.get('/reductions/:projectId', async (req, res, next) => {
    try {
        const projects = await getImpactList(req.params.projectId, req.query.scopes)

        return res.json(projects)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const project = await findOne(req.params.id, req.user)

        return res.json(project)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const project = await update(query, req.body)

        return res.json(project)
    } catch (error) {
        next(error)
    }
})

module.exports = router
