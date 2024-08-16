const express = require('express')
const router = express.Router()
const { list, findOne, create, update, remove } = require('../controllers/task')

router.post('/create', async (req, res, next) => {
    try {
        const task = await create(req.body)

        return res.status(201).json(task)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const tasks = await list(req.body)

        return res.json(tasks)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const task = await findOne(req.params.id)

        return res.json(task)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const task = await update(query, req.body)

        return res.json(task)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const task = await remove(query)

        return res.json(task)
    } catch (error) {
        next(error)
    }
})

module.exports = router
