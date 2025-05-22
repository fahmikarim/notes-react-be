import express from 'express';
import {
    getNotes, 
    createNotes,
    updateNotes,
    deleteNotes,
    getNoteById

} from '../controller/NotesController.js';

import {
    Register,
    Login,
    refreshToken,
    logout
} from '../controller/UserController.js';

import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

// User Routes
router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// Note Routes
router.get("/notes", verifyToken, getNotes);
router.get("/notes/:id", verifyToken, getNoteById);
router.post("/notes/add-notes", verifyToken, createNotes);
router.put("/notes/update-notes/:id", verifyToken, updateNotes);
router.delete("/notes/delete-notes/:id", verifyToken, deleteNotes);

router.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;