const express = require('express')
const router = express.Router()
const { create, list, findOne, update, remove } = require('../controllers/permission')

router.post('/create', async (req, res, next) => {
    try {
        const permission = await create(req.body)

        return res.status(201).json(permission)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const permissionList = await list()

        return res.json(permissionList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const permission = await findOne(req.params.id)

        return res.json(permission)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const permission = await update(query, req.body)

        return res.json(permission)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const permission = await remove(query)

        return res.json(permission)
    } catch (error) {
        next(error)
    }
})

module.exports = router
