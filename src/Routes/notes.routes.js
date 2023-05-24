const { Router } = require("express");
const NotesController = require("../Controllers/NotesController");
const ensureAuthentication = require("../Middlewares/ensureAuthentication");

const notesRoutes = Router();

const notesController = new NotesController();

notesRoutes.use(ensureAuthentication);

notesRoutes.post("/", notesController.create);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.get("/:id", notesController.show);
notesRoutes.get("/", notesController.index);

module.exports = notesRoutes;