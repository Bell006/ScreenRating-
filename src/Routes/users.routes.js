const { Router } = require("express");
const UsersController = require("../Controllers/UsersController");
const UserAvatarController = require("../Controllers/UserAvatarController");
const ensureAuthentication = require("../Middlewares/ensureAuthentication");

const multer = require("multer");
const uploadConfig = require("../Configs/upload");

//Passando as configurações de upload:
const upload = multer(uploadConfig.MULTER);

const usersRoutes = Router();

const usersController = new UsersController();
const avatarController = new UserAvatarController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthentication, usersController.update);
usersRoutes.patch("/avatar", ensureAuthentication, upload.single("avatar"), avatarController.update);
usersRoutes.delete("/", ensureAuthentication, usersController.delete);

module.exports = usersRoutes;