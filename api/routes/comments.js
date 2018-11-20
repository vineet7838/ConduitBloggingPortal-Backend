const {
    Router
} = require('express')
const {
    User,
    Comment,
    Article
} = require('../db/models/index')
const {
    Op
} = require('sequelize')
const auth = require('./auth')

const route = Router()

route.post('/', auth.required, async (req, res) => {

    const user = await User.findById(req.payload.id)
    if (!user) {
        return res.status(401).json({
            message: 'user doesnot exist'
        })
    }
    const findArticle = await Article.findOne({
        where: req.params.slug
    })
    console.log(findArticle)

    const newComment = await Comment.create({
        body: req.body.comment.body,
        userId: user.id,
        articleId: findArticle.id

    }).then((newComment) => {
        res.status(201).json({
            comment: newComment
        })
    })

})
route.get('/', auth.optional, async (req, res) => {


    const findArticle = await Article.findOne({
        where: {
            slug: req.baseUrl.split('/')[3]
        }
    }).then((findArticle) => {
        if (!findArticle) {
            res.status(401).json({
                message: 'Article not found'
            })
        }
        const comments = Comment.findAll({
            include: [{
                model: User,
                attributes: ['username', 'bio', 'image']
            }],
            where: {
                articleId: findArticle.id,
            },

        }).then((comments) => {
            allcomment = []
            comments.forEach(comments => {
                allcomment.push(comments.toSendJSONArray())
            })
            res.status(200).json({
                comments: allcomment
            })
        })
    })
})
route.delete('/:id', auth.required, async (req, res) => {


    const findArticle = await Article.findOne({
        where: {
            slug: req.baseUrl.split('/')[3]
        }
    }).then((findArticle) => {
        if (!findArticle) {
            res.status(401).json({
                message: 'Article not found'
            })
        }
        const findComment = Comment.findOne({
            where: {
                id: req.params.id
            }
        }).then((findComment) => {

            if (findComment.articleId !== findArticle.id) {
                res.status(404).json({
                    message: 'No Comment found'
                })
            }
            findComment.destroy()
            res.status(200).json({
                message: 'Comment deleted Successfully !'
            })
        })
    })
})

module.exports = route