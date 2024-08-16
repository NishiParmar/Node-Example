const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE metric SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /metric/create', () => {
        test('Valid creates new metric.', async () => {
            const metricObject = {
                name: 'Test Metric'
            }
            const res = await request(app)
                .post('/api/metric/create')
                .send(metricObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('put /metric/:id', () => {
        test('Valid updates metric data.', async () => {
            const METRIC_ID = testObjectId
            const res = await request(app)
                .put(`/api/metric/${METRIC_ID}`)
                .send({ name: 'Test Metric 2' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /metric/:id', () => {
        test('Valid returns metric data.', async () => {
            const METRIC_ID = testObjectId
            const res = await request(app)
                .get(`/api/metric/${METRIC_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(METRIC_ID)
        })

        test('Invalid returns no metric data.', async () => {
            const METRIC_ID = 0
            const res = await request(app)
                .get(`/api/metric/${METRIC_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })

    describe('get /metric/list', () => {
        test('Valid returns metric list.', async () => {
            const res = await request(app)
                .get('/api/metric/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })
}