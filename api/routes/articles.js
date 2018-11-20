const {
    Router
} = require('express')
const {
    Article,
    User,
    Tag
} = require('../db/models/index.js')
const {
    Op
} = require('sequelize')
const auth = require('./auth')
const route = Router()

route.use('/:slug/comments', require('./comments'))


route.post('/', async (req, res) => {

    if (req.get('Authorization')) {

        const jwtToken = req.get('Authorization')
        const user = await User.findOne({
            where: {
                token: jwtToken.split(' ')[1]
            }
        })
        const newArticle = new Article()
        newArticle.title = req.body.article.title;
        newArticle.description = req.body.article.description;
        newArticle.body = req.body.article.body
        newArticle.userId = user.id

        const tagList = req.body.article.tagList

        let tagArray = []
        for (tag in tagList) {
            await Tag.findOrCreate({
                where: {
                    name: tagList[tag]
                }
            }).spread((tagFoundOrCreated, created) => {
                tagArray.push(tagFoundOrCreated)

            })
        }

        newArticle.slug = newArticle.generateSlug(newArticle.title)
        newArticle.save().then((newArticle) => {
            newArticle.setTags(tagArray)
            res.status(201).json({
                article: newArticle
            })
        })
    } else {
        res.status(401).json({
            message: 'user not authenticated'
        })
    }
})

route.get('/', async (req, res) => {

    let limit = 1
    let offset = 0
    let whereClause = []
    for (let key of Object.keys(req.query)) {
        switch (key) {
            case 'tag':
                console.log('tag')
                break;
            case 'author':
                console.log('author')
                if (req.query.author) {
                    console.log('author=' + req.query.author);
                    const user = await User.findOne({
                        where: {
                            username: req.query.author
                        }
                    })
                    if (user) {
                        whereClause.push({
                            userId: user.id
                        })
                    }
                }
                break;
            case 'offset':
                console.log('offset')
                if (req.query.offset) {
                    offset = req.query.offset
                }
                break;
            case 'limit':
                if (req.query.limit) {
                    limit = req.query.limit
                }
                console.log('limit')
                break
        }
    }
    const articles = await Article.findAll({
        include: [{
            model: User,
            attributes: ['username', 'bio', 'image']
        }],
        where: {
            [Op.and]: whereClause

        },
        limit: limit,
        offset: offset
    })
    const abc = async function () {
        let newArticles = []

        const def = async function () {
            for (let article of articles) {
                const articleTags = await article.getTags({
                    attributes: ['name']
                })

                let tagList = []
                for (tag of articleTags) {
                    tagList.push(tag.name)
                }
                newArticles.push(article.toSendJSONArray(tagList))
            }
        }
        await def();
        res.status(200).json({
            articles: newArticles,
            articlesCount: newArticles.length
        })
    }
    await abc();
})

route.put('/:slug', auth.required, async (req, res) => {

    User.findById(req.payload.id).then((user) => {

        const findArticle = Article.findOne({
            where: {
                slug: req.params.slug
            }
        }).then((findArticle) => {

            if (!findArticle) {
                res.status(401).json({
                    message: 'Article not found'
                })
            }
            if (req.body.article.title && typeof req.body.article.title !== 'undefined') {
                findArticle.title = req.body.article.title;
                findArticle.slug = findArticle.generateSlug(findArticle.title)
            }

            if (req.body.article.description && typeof req.body.article.description !== 'undefined') {
                findArticle.description = req.body.article.description;
            }

            if (req.body.article.body && typeof req.body.article.body !== 'undefined') {
                findArticle.body = req.body.article.body;
            }
            findArticle.save()
            res.status(200).json({
                "message": "Article updated successfully",
                Article: findArticle
            })
        })
    })

})
route.delete('/:slug', auth.required, async (req, res) => {

    User.findById(req.payload.id).then((user) => {

        if (!user) {
            return res.status(401).json({
                message: 'user donot exist'
            })
        }
        const findArticle = Article.findOne({
            where: {
                slug: req.params.slug
            }
        }).then((findArticle) => {

            if (!findArticle) {
                res.status(401).json({
                    message: 'Article not found'
                })
            }
            if (findArticle.userId === user.id) {
                findArticle.destroy()
            }
            res.status(200).json({
                message: 'Article Deleted Successfully !'
            })
        })
    })
})
module.exports = route