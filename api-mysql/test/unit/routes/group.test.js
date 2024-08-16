const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE  \`group\` SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /group/create', () => {
        test('Valid creates new group.', async () => {
            const groupObject = {
                name: 'Opportunity Type',
                type: 'Test Type'
            }
            const res = await request(app)
                .post('/api/group/create')
                .send(groupObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('put /group/:id', () => {
        test('Valid updates group data.', async () => {
            const GROUP_ID = testObjectId
            const res = await request(app)
                .put(`/api/group/${GROUP_ID}`)
                .send({ name: 'Opportunity Type' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /group/list', () => {
        test('Valid returns group list.', async () => {
            const res = await request(app)
                .get('/api/group/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /group/:id', () => {
        test('Valid returns group data.', async () => {
            const GROUP_ID = testObjectId
            const res = await request(app)
                .get(`/api/group/${GROUP_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(GROUP_ID)
        })

        test('Invalid returns no group data.', async () => {
            const GROUP_ID = 0
            const res = await request(app)
                .get(`/api/group/${GROUP_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}