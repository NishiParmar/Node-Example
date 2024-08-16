const createHttpError = require('http-errors')
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const crypto = require('crypto')
const db = require('../models')
const { list: projectList } = require('../controllers/projects')
const { getPermissionData } = require('./userPermission')

async function create(payload) {
  const business = await db.business.create(payload)

  return business
}

async function findOne(businessId, userDetails) {
  const user = await getPermissionData(userDetails, 'sites', { business_id: businessId }, 'permittedSitesArray')
  let business = await db.business.findByPk(businessId, {
    attributes: ['id', 'name'],
    include: [
      {
        model: db.businessResource,
        include: { model: db.resource, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      },
      {
        model: db.AllowedSiteView,
        attributes: ['id', 'name', 'business_id', 'location_id', 'allowed'],
        where: { user_id: user.id, id: { [db.Sequelize.Op.in]: user.sites } },
        as: 'sites',
        required: true
      },
      {
        model: db.task,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          include: [[db.sequelize.literal('( SELECT c.name FROM `contact` AS c INNER JOIN `role` AS r ON r.contact_id = c.id WHERE r.table = \'task\' AND r.item_id = tasks.id LIMIT 1 )'), 'contactPerson']]
        },
        include: [{
          model: db.project,
          attributes: ['name']
        }]
      },
    ],
  })

  if (!business) {
    throw new createHttpError[404]('Business not found.')
  }

  business.logo = getLogoLink(business)

  business = JSON.parse(JSON.stringify(business))
  const projects = await projectList(businessId, userDetails)

  return { ...business, projects }
}

async function list(userDetails) {
  const data = await getPermissionData(userDetails, 'businesses')
  const businesses = data?.businesses || []

  businesses.forEach(business => {
    business.logo = getLogoLink(business)
  })

  return businesses
}

async function update(query, payload) {
  const business = await db.business.update(payload, { where: query })

  return business
}

function getLogoFilename(business, fileExtension) {
  if (!fileExtension) {
    fileExtension = 'png'
  }
  const hashString = `${business.name}-${business.id}`
  const fileBaseName = crypto.createHash('sha256').update(hashString).digest('hex').substring(0, 16)

  return fileBaseName + '.' + fileExtension
}

function getLogoLink(business) {
  const fileBaseName = getLogoFilename(business)

  return process.env.AWS_IMAGE_BUCKET_URL + fileBaseName
}

async function upload(payload, files) {
  const logo = files?.logo
  if (!logo) throw new createHttpError[400]('please provide logo image file in jpg, jpeg or png format!')
  const mimeType = logo.mimetype
  if (!(mimeType == 'image/png' || mimeType == 'image/jpg' || mimeType == 'image/jpeg')) {
    throw new createHttpError[400]('please upload image in either jpg, jpeg or png format!')
  }
  const business = await db.business.findByPk(payload.business_id)
  if (!business) throw new createHttpError[404]('business not found!')
  const fileContent = logo.data
  const fileExtension = logo.name.split('.').pop()
  const fileName = getLogoFilename(business, fileExtension)

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    }
  })
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_IMAGE_BUCKET,
    Key: fileName,
    Body: fileContent,
    // Allow public read access
    ACL: 'public-read'
  })

  const response = await client.send(command)

  return response
}

module.exports = { findOne, list, update, create, upload }
