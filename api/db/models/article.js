const Sequelize = require("sequelize");
const DT = Sequelize.DataTypes;

module.exports = {
    article: {
        slug: {
            type: DT.STRING(50)
        },
        title: {
            type: DT.STRING(50)
        },
        description: {
            type: DT.STRING(50)
        },
        body: {
            type: DT.STRING(50)
        }
    }
};