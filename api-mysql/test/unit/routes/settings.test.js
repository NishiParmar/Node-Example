const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId, businessId
afterAll(async () => {
    await db.sequelize.query(`UPDATE setting SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /setting/create', () => {
        test('Valid creates new setting.', async () => {
            const settingObject = {
                setting_name: 'Test Setting',
                value: '7',
                type: 'text',
                title: 'Cost of Carbon',
                business_id: 1,
                suffix: '$/TCO2'
            }
            const res = await request(app)
                .post('/api/setting/create')
                .send(settingObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.body.business_id).toBe(settingObject.business_id)
            testObjectId = res.body.id
            businessId = res.body.business_id
        })
    })

    describe('post /setting/list', () => {
        test('Valid returns settings list.', async () => {
            const res = await request(app)
                .post('/api/setting/list')
                .send({ business_id: businessId })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /setting/:code', () => {
        test('Valid updates setting data.', async () => {
            const BUSINESS_ID = businessId
            const SETTING_CODE = 'Test Setting'
            const res = await request(app)
                .put(`/api/setting/${SETTING_CODE}`)
                .send({ business_id: BUSINESS_ID, value: 8 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('post /setting/:id', () => {
        test('Valid returns setting data.', async () => {
            const BUSINESS_ID = businessId
            const res = await request(app)
                .post('/api/setting')
                .send({ setting_name: 'Test Setting', business_id: BUSINESS_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })

        test('Valid returns no setting data.', async () => {
            const BUSINESS_ID = 0
            const res = await request(app)
                .post('/api/setting')
                .send({ setting_name: 'baseLineYear', business_id: BUSINESS_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}
