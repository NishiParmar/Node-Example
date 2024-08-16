const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE unit SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /unit/create', () => {
        test('Valid creates unit.', async () => {
            const res = await request(app)
                .post('/api/unit/create')
                .send({ name: 'Test Wh', is_base: 1 })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('get /unit/list', () => {
        test('Valid returns unit list.', async () => {
            const res = await request(app)
                .get('/api/unit/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /unit/:id', () => {
        test('Valid returns unit data.', async () => {
            const UNIT_ID = testObjectId
            const res = await request(app)
                .get(`/api/unit/${UNIT_ID}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })

        test('Invalid returns error.', async () => {
            const UNIT_ID = 0
            const res = await request(app)
                .get(`/api/unit/${UNIT_ID}`)
                .expect('Content-Type', /json/)
                .expect(404)

            expect(res.statusCode).toBe(404)
        })
    })
}