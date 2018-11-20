const {
    Router
} = require('express')
const route = Router()


route.use('/users', require('./routes/users'))
route.use('/articles', require('./routes/articles'))
route.use('/user', require('./routes/user'))
route.use('/profiles', require('./routes/profiles'))
route.use('/tags', require('./routes/tags'))

route.get('/', async (req, res) => {
    res.status(200).json({
        error: {
            message: "specific resource api/users"
        }
    })
})

module.exports = route