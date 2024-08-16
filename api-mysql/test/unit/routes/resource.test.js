const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testResourceObjectId, testBusinessResourceObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE resource SET deleted_at='0000-00-00' WHERE id=${testResourceObjectId}`)
    await db.sequelize.query(`UPDATE business_resource SET deleted_at='0000-00-00' WHERE id=${testBusinessResourceObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /resource/create', () => {
        test('Valid creates new resource along with business resource.', async () => {
            const resourceObject = {
                name: 'Test Resource',
                class: 'Test Class',
                unit_id: 1,
                preferred_unit: 2,
                business_id: 1
            }
            const res = await request(app)
                .post('/api/resource/create')
                .send(resourceObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            const responseBodyData = res.body
            expect(Object.keys(responseBodyData).length).toEqual(2)
            testResourceObjectId = res.body.resource.id
            testBusinessResourceObjectId = res.body.businessResource.id
        })
    })


    describe('post /resource/list', () => {
        test('Valid returns only contracted resources list.', async () => {
            const res = await request(app)
                .post('/api/resource/list')
                .send({ business_id: 1, isContractedResources: true })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })

        test('Valid returns only un-contracted resources list.', async () => {
            const res = await request(app)
                .post('/api/resource/list')
                .send({ business_id: 1, isContractedResources: false })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })

        test('Valid returns all resource list for particular business.', async () => {
            const res = await request(app)
                .post('/api/resource/list')
                .send({ business_id: 1 })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /resource/:id', () => {
        test('Valid updates resource data.', async () => {
            const RESOURCE_ID = testResourceObjectId
            const res = await request(app)
                .put(`/api/resource/${RESOURCE_ID}`)
                .send({ name: 'Tese Resource' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /resource/:id', () => {
        test('Valid returns resource data.', async () => {
            const RESOURCE_ID = testResourceObjectId
            const res = await request(app)
                .get(`/api/resource/${RESOURCE_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })

        test('Valid returns no resource data.', async () => {
            const RESOURCE_ID = 0
            const res = await request(app)
                .get(`/api/resource/${RESOURCE_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}