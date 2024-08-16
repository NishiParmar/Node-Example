const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE group_tag SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /group-tag/create', () => {
        test('Valid creates new group-tag.', async () => {
            const groupTagObject = {
                group_id: 1,
                table: 'opportunity',
                item_id: 1
            }
            const res = await request(app)
                .post('/api/group-tag/create')
                .send(groupTagObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('get /group-tag/list', () => {
        test('Valid returns group-tag list.', async () => {
            const res = await request(app)
                .get('/api/group-tag/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /group-tag/:id', () => {
        test('Valid updates group-tag data.', async () => {
            const GROUP_TAG_ID = testObjectId
            const res = await request(app)
                .put(`/api/group-tag/${GROUP_TAG_ID}`)
                .send({ group_id: 1 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /group-tag/:id', () => {
        test('Valid returns group-tag data.', async () => {
            const GROUP_TAG_ID = testObjectId
            const res = await request(app)
                .get(`/api/group-tag/${GROUP_TAG_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(GROUP_TAG_ID)
        })

        test('Invalid returns no group-tag data.', async () => {
            const GROUP_TAG_ID = 0
            const res = await request(app)
                .get(`/api/group-tag/${GROUP_TAG_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}