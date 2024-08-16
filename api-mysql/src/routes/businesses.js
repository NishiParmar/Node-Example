const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router()
const { list, findOne, create, update, upload } = require('../controllers/businesses')

router.use(fileUpload({
    limits: {
        fileSize: 1024 * 1024 * 10 // 10Mb
    },
    abortOnLimit: true
}))

router.get('/list', async (req, res, next) => {
    try {
        const businesses = await list(req.user)

        return res.json(businesses)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const businessId = req.params.id
        const business = await findOne(businessId, req.user)

        return res.json(business)
    } catch (error) {
        next(error)
    }
})

router.post('/create', async (req, res, next) => {
    try {
        const business = await create(req.body)

        return res.status(201).json(business)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const business = await update(query, req.body)

        return res.json(business)
    } catch (error) {
        next(error)
    }
})

router.post('/upload', async (req, res, next) => {
    try {
        const data = await upload(req.body, req.files)

        return res.json(data)
    } catch (error) {
        next(error)
    }
})

module.exports = router
