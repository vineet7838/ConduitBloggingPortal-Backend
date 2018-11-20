const {
    Router
} = require('express')
const {
    User
} = require('../db/models/index')
const auth = require('./auth')


const route = Router()

route.get('/:username', auth.optional, async (req, res) => {

    if (req.payload) {
        const user = User.findById(req.payload.id).then((user) => {

            if (!user) {
                res.status(401).json({
                    message: 'user not found'
                })
            }
            res.status(200).json({
                User: user
            })
        })
    } else {
        res.status(401).json({
            message: 'Unauthorized User'
        })
    }
})
module.exports = route