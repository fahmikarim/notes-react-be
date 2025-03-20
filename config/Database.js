import { Sequelize } from "sequelize";

const db = new Sequelize('notes', 'root', 'lingkarankecil', {
    host: '130.211.201.103',
    dialect: 'mysql',
});

export default db;
