const Sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const slug = require('slug')
const {
    user
} = require('./user')
const {
    article
} = require('./article')
const {
    comment
} = require('./comment')
const {
    tag
} = require('./tag')
const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/store.db'
})


const User = db.define('user', user)
const Article = db.define('article', article)
const Comment = db.define('comment', comment)
const Tag = db.define('tag', tag)

Article.belongsTo(User)
User.hasMany(Article)

Comment.belongsTo(User)
User.hasMany(Comment)

Comment.belongsTo(Article)
Article.hasMany(Comment)

Tag.belongsToMany(Article, {
    through: 'articleTag'
})
Article.belongsToMany(Tag, {
    through: 'articleTag'
})

User.prototype.generateJwtToken = function () {
    return jwt.sign({
        id: this.id,
        username: this.username,
    }, 'karan')
}

Article.prototype.generateSlug = function (title) {
    let titleslug = slug(title) + "-" + (Math.random() * Math.pow(36, 6) | 0).toString(36)
    return titleslug
}
Article.prototype.toSendJSON = function () {
    return {
        article: {
            slug: this.slug,
            title: this.title,
            description: this.description,
            body: this.body,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            author: {
                username: this.user.username,
                bio: this.user.bio,
                image: this.user.image
            }
        }
    }
}
Article.prototype.toSendJSONArray = function (tagList) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: tagList,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: {
            username: this.user.username,
            bio: this.user.bio,
            image: this.user.image
        }
    }
}
Comment.prototype.toSendJSONArray = function () {

    return {
        id: this.comment,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        body: this.body,
        author: {
            username: this.user.username,
            bio: this.user.bio,
            image: this.user.image,
        }
    }
}
Tag.prototype.toSendJSONArray = function () {
    return this.name
}

module.exports = {
    db,
    User,
    Article,
    Comment,
    Tag
}