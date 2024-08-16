const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE meter SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /meter/create', () => {
        test('Valid creates new meter.', async () => {
            const meterObject = {
                name: 'Test Meter',
                contract_id: null,
                resource_id: null,
                location_id: null
            }
            const res = await request(app)
                .post('/api/meter/create')
                .send(meterObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('put /meter/:id', () => {
        test('Valid updates meter data.', async () => {
            const METER_ID = testObjectId
            const res = await request(app)
                .put(`/api/meter/${METER_ID}`)
                .send({ name: 'Updated Test Meter' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /meter/list', () => {
        test('Valid returns meter list.', async () => {
            const res = await request(app)
                .get('/api/meter/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /meter/:id', () => {
        test('Valid returns meter data.', async () => {
            const METER_ID = testObjectId
            const res = await request(app)
                .get(`/api/meter/${METER_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(METER_ID)
        })

        test('Invalid returns no meter data.', async () => {
            const METER_ID = 0
            const res = await request(app)
                .get(`/api/meter/${METER_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}