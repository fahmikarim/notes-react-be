import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const Users = db.define(
    "user",
    {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,

        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        refresh_token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
        tableName: "user",
        timestamps: false,
    }
);
export default Users;

