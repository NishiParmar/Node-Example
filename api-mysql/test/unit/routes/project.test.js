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
    describe('post /project/list', () => {
        test('Valid returns project list.', async () => {
            const BUSINESS_ID = 1
            const res = await request(app)
                .post('/api/project/list')
                .send({ business_id: BUSINESS_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('post /project/cost', () => {
        test('Valid returns project costs.', async () => {
            const PROJECT_ID = 4
            const res = await request(app)
                .post('/api/project/cost')
                .send({ projectId: PROJECT_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('post /project/reductions', () => {
        test('Valid returns reductions for particular project.', async () => {
            const PROJECT_ID = 1
            const res = await request(app)
                .post('/api/project/reductions')
                .send({ projectId: PROJECT_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /project/reductions/:oppId', () => {
        test('Valid returns reductions for particular project.', async () => {
            const PROJECT_ID = 1
            const SCOPES = [1, 2, 3]
            const res = await request(app)
                .get(`/api/project/reductions/${PROJECT_ID}?scopes=${SCOPES}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /project/:id', () => {
        test('Valid updates project data.', async () => {
            const PROJECT_ID = 1
            const projectObject = { description: 'EV Ute' }
            const res = await request(app)
                .put(`/api/project/${PROJECT_ID}`)
                .send(projectObject)
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })

        test('Valid updates project data and adjusts the cashflows and impacts according to economic life.', async () => {
            const PROJECT_ID = 1
            const projectObject = {
                description: 'EV Ute',
                economic_life: 13
            }
            const res = await request(app)
                .put(`/api/project/${PROJECT_ID}`)
                .send(projectObject)
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /project/:id', () => {
        test('Valid returns project data.', async () => {
            const PROJECT_ID = 1
            const res = await request(app)
                .get(`/api/project/${PROJECT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(PROJECT_ID)
        })

        test('Invalid returns no project data.', async () => {
            const PROJECT_ID = 100
            const res = await request(app)
                .get(`/api/project/${PROJECT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })

    describe('post /project/create', () => {
        test('Valid creates new project and businesscase.', async () => {
            const projectObject = {
                name: 'Test Case PROJECT',
                business_id: 1,
                description: 'New PROJECT',
                start_date: '2024-05-01',
                end_date: '2025-05-09',
                status: 'in-progress',
                economic_life: 10,
                site_id: 1
            }
            const res = await request(app)
                .post('/api/project/create')
                .send(projectObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
        })
    })
}