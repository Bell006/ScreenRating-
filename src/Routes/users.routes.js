const { Router } = require("express");
const UsersController = require("../Controllers/usersController");
const ensureAuthentication = require("../Middlewares/ensureAuthentication");

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthentication, usersController.update)
usersRoutes.delete("/", ensureAuthentication, usersController.delete)

module.exports = usersRoutes;