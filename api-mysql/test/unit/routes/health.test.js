const { app, server } = require('../../../app')
const request = require('supertest')

afterAll(() => {
    server.close()
})

describe('GET /api/health', () => {
    test('valid returns success', async () => {
        const res = await request(app)
            .get('/api/health')
            .expect('Content-Type', /json/)
            .expect(200)
        expect(res.body.message).toEqual('database connection successfully established')
    })
})
