const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/groupTag')

router.post('/create', async (req, res, next) => {
    try {
        const groupTag = await create(req.body)

        return res.status(201).json(groupTag)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const groupTagList = await list()

        return res.json(groupTagList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const groupTag = await findOne(req.params.id)

        return res.json(groupTag)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const groupTag = await update(query, req.body)

        return res.json(groupTag)
    } catch (error) {
        next(error)
    }
})

module.exports = router
