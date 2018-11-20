const {
    Router
} = require('express')
const {
    User
} = require('../db/models/index.js')

const route = Router()

route.get('/', async (req, res) => {

    if (req.get('Authorization')) {
        const jwtToken = req.get('Authorization')
        console.log(jwtToken.split(' ')[1])
        const user = await User.findOne({
                where: {
                    token: jwtToken.split(' ')[1]
                }
            })
            .then((user) => {
                if (!user) {
                    res.status(400).json({
                        message: "username not found"
                    })
                }
                res.status(200).json({
                    User: user
                })
            }).catch(console.error)
    }
})

route.put('/', async (req, res) => {
    if (req.get('Authorization')) {
        const jwtToken = req.get('Authorization')
        const user = await User.findOne({
            where: {
                token: jwtToken.split(' ')[1]
            }
        }).then((user) => {
            if (!user) {
                res.status(204).json({
                    message: "username not found"
                })
            }
            if (req.body.user.username && typeof req.body.user.username !== undefined ) {
                user.username = req.body.user.username;
            }
            if (req.body.user.email && typeof req.body.user.email !== undefined) {
                user.email = req.body.user.email
            }
            if (req.body.user.password && typeof req.body.user.password !== undefined) {
                user.password = req.body.user.password
            }
            if (req.body.user.bio && typeof req.body.user.bio !== undefined) {
                user.bio = req.body.user.bio
            }
            if (req.body.user.image && typeof req.body.user.image !== undefined) {
                user.image = req.body.user.image
            }
            user.save()
            res.status(200).json({
                message: "user successfull updated",
                User: user
            })
        }).catch((error)=>{
            res.status(400).json({
                message:"user is not updated"
            })
        })
    }
})



module.exports = route