const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/group')

router.post('/create', async (req, res, next) => {
    try {
        const group = await create(req.body)

        return res.status(201).json(group)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const groupList = await list()

        return res.json(groupList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const group = await findOne(req.params.id)

        return res.json(group)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const group = await update(query, req.body)

        return res.json(group)
    } catch (error) {
        next(error)
    }
})

module.exports = router
