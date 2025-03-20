import { Sequelize } from "sequelize";

const db = new Sequelize('notes', 'root', 'lingkarankecil', {
    host: 'senseor',
    dialect: 'mysql',
});

export default db;
