const express = require('express')
const router = express.Router()
const { list, findOne } = require('../controllers/emissions')

router.post('/list', async (req, res, next) => {
    try {
        const emissionList = await list(req.user, req.body.business_id)

        return res.json(emissionList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const emission = await findOne(req.params.id)

        return res.json(emission)
    } catch (error) {
        next(error)
    }
})

module.exports = router
