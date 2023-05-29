const { Router } = require("express");
const TagsController = require("../Controllers/TagsController")

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get("/", tagsController.index)

module.exports = tagsRoutes;