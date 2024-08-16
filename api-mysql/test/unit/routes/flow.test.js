const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
// const db = require('../../../src/models')

afterAll(async () => {
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /flow/list', () => {
        test('Valid returns flow list.', async () => {
            const res = await request(app)
                .post('/api/flow/list')
                .send({ business_id: 1 })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /flow/:id', () => {
        test('Valid updates flow data.', async () => {
            const FLOW_ID = 0
            const res = await request(app)
                .put(`/api/flow/${FLOW_ID}`)
                .send({ value: 22579 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /flow/:id', () => {
        test('Valid returns flow data.', async () => {
            const FLOW_ID = 1
            const res = await request(app)
                .get(`/api/flow/${FLOW_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(FLOW_ID)
        })

        test('Invalid returns no flow data.', async () => {
            const FLOW_ID = 0
            const res = await request(app)
                .get(`/api/flow/${FLOW_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}