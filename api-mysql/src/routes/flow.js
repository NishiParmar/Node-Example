const express = require('express')
const router = express.Router()
const { list, findOne, create, createFlowsFromFile, update } = require('../controllers/flow')
const fileUpload = require('express-fileupload')
const verifyAdmin = require('../middlewares/verify.admin.middleware')

router.use(fileUpload())
router.post('/create', verifyAdmin, async (req, res, next) => {
    try {
        const flow = await createFlowsFromFile(req.files, req.body.business_id)

        return res.status(201).json(flow)
    } catch (error) {
        next(error)
    }
})

router.post('/', verifyAdmin, async (req, res, next) => {
    try {
        const flow = await create(req.user, req.body)

        return res.status(201).json(flow)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const flows = await list(req.body)

        return res.json(flows)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const flow = await findOne(req.params.id)

        return res.json(flow)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const flow = await update(query, req.body)

        return res.json(flow)
    } catch (error) {
        next(error)
    }
})

module.exports = router
