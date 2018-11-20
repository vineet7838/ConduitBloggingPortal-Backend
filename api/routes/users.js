const {
    Router
} = require('express')
const {
    User
} = require('../db/models/index.js')

const route = Router()

route.post('/', async (req, res) => {
    console.log(User)


    const newUser = await User.create({
        username: req.body.user.username,
        email: req.body.user.email,
        password: req.body.user.password
    }).then((newUser) => {
        res.status(201).json({
            message: 'User added',
            id: newUser.id,
        })
    }).catch((error) => {
        res.status(400).send(error.errors[0].message)
    })
})

route.post('/login', async (req, res) => {
    if (req.body.user.email) {
        const user = await User.findOne({
            where: {
                email: req.body.user.email,
            }
        }).then((user) => {
            if (!user) {
                res.status(400).json({
                    message: "username not found"
                })
            }
            let jwtToken = user.generateJwtToken()
            console.log(jwtToken)
            user.token = jwtToken
            user.save().then(() => {
                res.status(201).json({
                    user: user
                })
            })
        })
    }
})


module.exports = route