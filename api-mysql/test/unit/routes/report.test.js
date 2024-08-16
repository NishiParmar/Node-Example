const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

afterAll(() => {
    db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('get /report', () => {
        test('Valid returns reports', async () => {
            const res = await request(app)
                .get('/api/report')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('post /report/url', () => {
        test('Valid returns metabase url.', async () => {
            const input = {
                business_id: 1,
                question: 1,
                dashboard: 1,
            }
            const res = await request(app)
                .post('/api/report/url')
                .send(input)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
    })
}