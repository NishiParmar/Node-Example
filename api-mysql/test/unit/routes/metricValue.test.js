const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE metric_value SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /metric-value/create', () => {
        test('Valid creates new metric-value.', async () => {
            const metricValueObject = {
                metric_id: 1,
                value: 1000,
                start_date: '2022-01-01',
                end_date: '2022-01-31'
            }
            const res = await request(app)
                .post('/api/metric-value/create')
                .send(metricValueObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('put /metric-value/:id', () => {
        test('Valid updates metric-value data.', async () => {
            const METRIC_VALUE_ID = testObjectId
            const res = await request(app)
                .put(`/api/metric-value/${METRIC_VALUE_ID}`)
                .send({ value: 3569 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /metric-value/list', () => {
        test('Valid returns metric-value list.', async () => {
            const res = await request(app)
                .get('/api/metric-value/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /metric-value/:id', () => {
        test('Valid returns metric-value data.', async () => {
            const METRIC_VALUE_ID = testObjectId
            const res = await request(app)
                .get(`/api/metric-value/${METRIC_VALUE_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(METRIC_VALUE_ID)
        })

        test('Invalid returns no metric-value data.', async () => {
            const METRIC_VALUE_ID = 0
            const res = await request(app)
                .get(`/api/metric-value/${METRIC_VALUE_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}