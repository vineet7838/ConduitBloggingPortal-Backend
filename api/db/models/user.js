const Sequelize = require("sequelize");
const DT = Sequelize.DataTypes;

module.exports = {
    user: {
        username: {
            type: DT.STRING(50),
            allowNull: false,
            unique: true
        },
        email: {
            type: DT.STRING(50),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Must be in email format"
                }
            },
            unique: true
        },
        password: {
            type: DT.STRING(50),
            allowNull: true,
            unique: true
        },
        bio: {
            type: DT.STRING(50),
            defaultValue: ' '
        },
        image: {
            type: DT.STRING(50),
            defaultValue: ' '
        },
        token: {
            type: DT.STRING(500)
        }
    }
};