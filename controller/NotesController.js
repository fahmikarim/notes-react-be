import Notes from "../models/NoteModel.js";

const createNotes = async (req, res) =>{
    const { title, content, field } = req.body;
    const user_id = req.user.user_id;
    try {
        const notes = await Notes.create({
            title,
            content,
            field,
            user_id
        });
        res.status(201).json({
            msg: "Note Created",
            data: notes,
            user_id: user_id
        });
    } catch (error){
        res.status(500).json({
            msg: "Failed to create note",
            error: error.message
        });
    }

}

const getNotes = async (req, res) =>{
    const user_id = req.user.user_id;
    try{
        const notes = await Notes.findAll({ where: { user_id: user_id }} );
        res.status(200).json({
            msg: "Notes retrieved successfully",
            data: notes,
            user_id: user_id
        });
    }catch(error){
        res.status(500).json({
            msg: "Failed to retrieve notes",
            error: error.message
        });
    }

}

const updateNotes = async (req, res) =>{
    const { id} = req.params;
    const user_id = req.user.user_id;
    const { title, content, field } = req.body;

    try {
        const notes = await Notes.update(
            {
                title,
                content, 
                field,
            },
            {
                where: {
                    id,
                    user_id: user_id
                }
            }
        );
        res.status(200).json({
            msg: "Note Updated",
            data: notes,
            user_id: user_id
        });
    }catch (error){
        res.status(500).json({message: error.message});
    }
}

const deleteNotes = async (req, res) =>{
    const { id} = req.params;
    const user_id = req.user.user_id;

    try {
        const notes = await Notes.destroy({
            where: {
                id,
                user_id: user_id
            }
        });
        res.status(200).json({
            msg: "Note Deleted",
            data: notes,
            user_id: user_id
        });
    }catch (error){
        res.status(500).json({
            msg: "Failed to delete note",
            error: error.message
        });
    }
}

const getNoteById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.user_id;

    try {
        const note = await Notes.findOne({
            where: {
                id: id,
                user_id: user_id
            }
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            msg: "Note retrieved successfully",
            data: note
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export { createNotes, getNotes, updateNotes, deleteNotes, getNoteById };

