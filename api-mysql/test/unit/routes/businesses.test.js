const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
  await db.sequelize.query(`UPDATE business SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
  // await db.sequelize.close()
  server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
  next()
})

module.exports = () => {
  describe('post /businesses/create', () => {
    test('Valid creates new business.', async () => {
      const res = await request(app)
        .post('/api/businesses/create')
        .send({ name: 'Test Business' })
        .expect('Content-Type', /json/)
        .expect(201)

      expect(res.body.name).toBe('Test Business')
      testObjectId = res.body.id
    })
  })

  describe('get /businesses/:id', () => {
    test('Valid returns business data.', async () => {
      const BUSINESS_ID = testObjectId
      const res = await request(app)
        .get(`/api/businesses/${BUSINESS_ID}`)
        .expect('Content-Type', /json/)
        .expect(200)
      expect(res.statusCode).toBe(200)

      const responseBodyData = res.body
      expect(responseBodyData).not.toBeNull()

      // const expectedKeys = ['business', 'sites', 'projects', 'tasks', 'users']
      // const actualKeys = Object.keys(responseBodyData)

      // expect(actualKeys).toEqual(expectedKeys)

      // check data
      // expect(responseBodyData).not.toBeNull()
      // expect(responseBodyData.id).toEqual(BUSINESS_ID)
      // expect(responseBodyData.sites.length).toBeGreaterThan(0)
      // expect(responseBodyData.projects.length).toBeGreaterThan(0)
      // expect(responseBodyData.tasks.length).toBeGreaterThan(0)
      // expect(responseBodyData.users.length).toBeGreaterThan(0)
    })

    test('Valid returns no business data.', async () => {
      const BUSINESS_ID = 0 // no data

      const res = await request(app)
        .get(`/api/businesses/${BUSINESS_ID}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.message).toEqual('Business not found.')
    })
  })

  describe('put /businesses/:id', () => {
    test('Valid updates business data.', async () => {
      const BUSINESS_ID = testObjectId
      const res = await request(app)
        .put(`/api/businesses/${BUSINESS_ID}`)
        .send({ name: 'Test Business 2' })
        .expect('Content-Type', /json/)
        .expect(200)

      const [responseBodyData] = res.body
      expect(responseBodyData).toBeGreaterThanOrEqual(0)
    })
  })

  describe('get /businesses/list', () => {
    test('Valid returns business list.', async () => {
      const res = await request(app)
        .get('/api/businesses/list')

      expect(res.statusCode).toBe(200)
    })
  })
}