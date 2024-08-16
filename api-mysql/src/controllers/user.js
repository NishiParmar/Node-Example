const createHttpError = require('http-errors')
const { AdminAddUserToGroupCommand, CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider')
const db = require('../models')

async function createUser(email) {
    if (!email) throw new createHttpError[400]('user email not provided!')
    let user = await db.user.findOne({ where: { email } })
    if (!user) {
        user = await db.user.create({ email })
    }

    return user
}

async function list() {
    const userList = await db.user.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [{
            model: db.permissionUser,
            attributes: ['id', 'user_id', 'permission_group'],
            include: [{
                model: db.permissionGroup,
                attributes: ['id', 'name'],
            }]
        }]
    })

    return userList
}

async function create(payload) {
    const log = await db.userLogs.create(payload)

    return log
}

async function addUserToGroup(body) {
    if (!body.username) {
        throw new createHttpError[400]('username is required')
    }
    const provider = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    })
    const username = body.username
    const groupname = body.groupname ? body.groupname : 'TestBusiness'
    const params = {
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        Username: username,
        GroupName: groupname
    }
    const command = new AdminAddUserToGroupCommand(params)
    await provider.send(command)

    return { message: `Success adding ${username} to ${groupname}` }
}

async function getCurrentUser(accessToken) {
    if (!accessToken) {
        throw new createHttpError[400]('Access token is missing')
    }

    const client = new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION,
    })

    // Verify the access token using AWS Cognito
    const params = {
        AccessToken: accessToken,
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    }

    const command = new GetUserCommand(params)
    const response = await client.send(command)

    // If the response doesn't contain an error, the user is authenticated
    return response
}

module.exports = { create, list, addUserToGroup, getCurrentUser, createUser }
