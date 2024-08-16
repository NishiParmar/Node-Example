const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE location SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /location/create', () => {
        test('Valid creates new location.', async () => {
            const locationObject = {
                address: 'Test Address',
                city: 'Vadodara',
                state: 'Gujarat',
                postcode: 395012,
                location_gps: '-12.4282886373961,130.900256053982'
            }
            const res = await request(app)
                .post('/api/location/create')
                .send(locationObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('get /location/list', () => {
        test('Valid returns location list.', async () => {
            const res = await request(app)
                .get('/api/location/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /location/:id', () => {
        test('Valid updates location data.', async () => {
            const LOCATION_ID = testObjectId
            const res = await request(app)
                .put(`/api/location/${LOCATION_ID}`)
                .send({ postcode: 395014 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /location/:id', () => {
        test('Valid returns location data.', async () => {
            const LOCATION_ID = testObjectId
            const res = await request(app)
                .get(`/api/location/${LOCATION_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(LOCATION_ID)
        })

        test('Invalid returns no location data.', async () => {
            const LOCATION_ID = 0
            const res = await request(app)
                .get(`/api/location/${LOCATION_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}