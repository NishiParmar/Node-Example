const db = require('../models')

async function list() {
    const paths = await db.path.findAll({
        include: [{
            model: db.path,
            as: 'parent_path',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        }],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    })

    return paths
}

module.exports = { list }