import db from "../config/Database.js";
import Users from "./UserModel.js";
import Notes from "./NoteModel.js";

//Relation
Users.hasMany(Notes, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
Notes.belongsTo(Users, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

//Sinkronasi semua tabel
(async () => {
    try {
        await db.authenticate();
        console.log("Database connected...");

        await db.sync({alter: true});
        console.log("Database synced...");
    } catch (error){
        console.error("Database connection failed: ", error);
    }
})();

export { Users, Notes };