const createHttpError = require('http-errors')
const db = require('../models')
const { getPermissionData } = require('./userPermission')

async function findOne(projectId, userDetails) {
   let projectObject = await db.project.findByPk(projectId, { attributes: ['business_id'], raw: true })
   if (!projectObject) throw new createHttpError[404]('Project not found.')
   const { business_id: businessId } = projectObject

   const user = await getPermissionData(userDetails, 'sites', { business_id: businessId }, 'permittedSitesArray')
   let project = await db.project.findByPk(projectId, {
      include: [
         { model: db.ProjectListView, as: 'projectDetails' },
         { model: db.task, attributes: ['name', 'status', 'id'] },
         {
            model: db.AllowedBusinessView,
            attributes: ['id', 'name', 'industry_id', 'main_office_site_id'],
            where: { user_id: user.id || null },
            as: 'business',
            required: true
         },
         {
            model: db.AllowedSiteView,
            attributes: ['id', 'name', 'business_id', 'location_id'],
            where: { user_id: user.id || null },
            as: 'site',
            required: true
         },
         { model: db.impact },
         { model: db.cashflow },
      ]
   })

   if (!project) {
      throw new createHttpError[404]('Project not found.')
   }

   project = JSON.parse(JSON.stringify(project))

   let projectResponse = {}
   const { projectDetails, ...rest } = project
   let projectData = {}
   if (typeof projectDetails == 'object' && Object.keys('projectDetails').length > 0) {
      projectData = { ...projectDetails }
   }

   projectResponse = { ...projectData, ...rest }



   return projectResponse
}

async function list(businessId, userDetails) {
   const user = await getPermissionData(userDetails, 'sites', null, 'allPermittedSitesPerBusinesses')
   let projectsList = []
   if (user) {
      const projects = await db.project.findAll({
         where: { business_id: businessId },
         include: [
            { model: db.ProjectListView, as: 'projectDetails' },
            { model: db.cashflow },
            { model: db.task, attributes: ['name', 'status'] },
            {
               model: db.impact,
               include: [{ model: db.contractPeriod }]
            },
            {
               model: db.AllowedSiteView,
               attributes: ['id', 'name', 'business_id', 'location_id'],
               where: { user_id: user.id, business_id: businessId, id: { [db.Sequelize.Op.in]: user.sites } },
               as: 'site',
               required: true
            },
         ]
      })

      projectsList = JSON.parse(JSON.stringify(projects)).map((project) => {
         const { projectDetails, ...rest } = project
         let newProject = {}
         if (typeof projectDetails == 'object' && Object.keys('projectDetails').length > 0) {
            newProject = { ...projectDetails }
         }

         return { ...newProject, ...rest }
      })
   }

   return projectsList
}

async function create(payload) {
   const projects = await db.project.create(payload)

   return projects
}

async function update(query, payload) {
   const economic_life = payload?.economic_life
   if (economic_life) {
      const project = await db.project.findOne({ where: query, raw: true })
      if (project && project.economic_life > economic_life) {
         const cashflowFilter = { project_id: project.id, year_offset: { [db.Sequelize.Op.gte]: economic_life } }
         await db.cashflow.destroy({ where: cashflowFilter })
         const impactFilter = { project_id: project.id, year_offset: { [db.Sequelize.Op.gte]: economic_life } }
         await db.impact.destroy({ where: impactFilter })
      }
   }
   const project = await db.project.update(payload, { where: query })

   return project
}

async function getProjectCosts(projectId) {

   const project = await db.project.findByPk(projectId)
   if (!project) return []
   const [results] = await db.sequelize.query(`WITH recursive years AS (
      SELECT
         0 year_offset
      UNION ALL
      SELECT
         year_offset + 1
      FROM
         years
      WHERE
         year_offset < ${project.economic_life}
   )
   SELECT
      years.year_offset,
      project.id,
      SUM(COALESCE(cost_capex.cashflow, 0)) capex,
      SUM(COALESCE(cost_opex.cashflow, 0)) opex,
      SUM(COALESCE(cost_opex.cashflow, 0)) otherCost,
      cost_other.type AS otherCostName
   FROM
      (years, project)
      LEFT JOIN cashflow cost_opex ON cost_opex.project_id = project.id
      AND cost_opex.year_offset <= years.year_offset
      AND cost_opex.type = 'OPEX'
      LEFT JOIN cashflow cost_capex ON cost_capex.project_id = project.id
      AND cost_capex.year_offset <= years.year_offset
      AND cost_capex.type = 'CAPEX'
      LEFT JOIN cashflow cost_other ON cost_opex.project_id = project.id
      AND cost_opex.year_offset <= years.year_offset
      AND cost_opex.type != 'OPEX'
      AND cost_opex.type != 'CAPEX'
      LEFT JOIN impact ON impact.project_id = project.id
     LEFT JOIN contract_period ON impact.contract_period_id = contract_period.id AND contract_period.projected = true 
     LEFT JOIN emissions_factor ON emissions_factor.start_date = contract_period.start_date AND emissions_factor.end_date = contract_period.end_date 
   WHERE
      project.business_id = ${project.business_id}
      AND project.id = ${project.id}
   GROUP BY
      project.id,
      years.year_offset
   ORDER BY
      project.id,
      years.year_offset;`)

   return results
}

async function getReductionData(projectId) {
   const project = await db.project.findByPk(projectId)
   if (!project) return []

   const [results] = await db.sequelize.query(`WITH recursive years AS (
   SELECT
      0 year_offset
   UNION ALL
   SELECT
      year_offset + 1
   FROM
      years
   WHERE
      year_offset < ${project.economic_life}
)
SELECT
   years.year_offset,
   project.id,
   project.name AS project_name,
   project.business_id,
   resource.name AS resourceTypeName,
   resource.id AS resourceTypeId,
   SUM(COALESCE(scope1.value, 0)) scope1,
   SUM(COALESCE(scope2.value, 0)) scope2,
   SUM(COALESCE(scope3.value, 0)) scope3
FROM 
   (years, project)
   JOIN impact ON impact.project_id = project.id and impact.year_offset = years.year_offset
   JOIN contract_period ON impact.contract_period_id = contract_period.id
   JOIN contract ON contract_period.contract_id = contract.id
   JOIN resource ON contract.resource_id = resource.id
   LEFT JOIN emissions_factor scope1 ON resource.id = scope1.resource_id AND scope1.scope = 1
   LEFT JOIN emissions_factor scope2 ON resource.id = scope2.resource_id AND scope2.scope = 2
   LEFT JOIN emissions_factor scope3 ON resource.id = scope3.resource_id AND scope3.scope = 3
WHERE
   project.business_id = ${project.business_id} AND project.id = ${project.id}
GROUP BY
   project.id,
   years.year_offset,
   resource.id
ORDER BY
   project.id,
   years.year_offset;`)

   return results
}

module.exports = { findOne, list, create, update, getProjectCosts, getReductionData }

