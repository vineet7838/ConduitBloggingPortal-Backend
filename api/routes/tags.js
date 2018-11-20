const {
    Router
} = require('express')
const {
    Tag
} = require('../db/models/index')
const auth = require('./auth')


const route = Router()


route.get('/', auth.optional, async (req, res) => {



    const findTags = await Tag.findAll().then((tags) => {
        allTags = []
        for (tag of tags) {
            allTags.push(tag.toSendJSONArray())
        }
        if (allTags == null) {
            res.status(404).json({
                "message": "No tags were found"
            })
        }
        res.status(200).json({
            tags: allTags
        })
    })
})
module.exports = route