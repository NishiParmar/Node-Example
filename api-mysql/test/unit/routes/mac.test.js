const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
// const db = require('../../../src/models')

afterAll(() => {
    // db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /mac/list', () => {
        test('Valid returns mac list', async () => {
            const res = await request(app)
                .post('/api/mac/list')
                .send({ business_id: 1, year_offset: 1 })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })
}