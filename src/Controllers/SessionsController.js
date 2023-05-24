const knex = require("../database/knex");
const AppError = require("../Utils/AppError");

const { compare } = require("bcryptjs");

const authConfig = require("../Configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body;

        const user = await knex("users").where({ email }).first();

        if(!user) {
            throw new AppError("E-mail e/ou senha incorretos", 401);
        }
        
        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch) {
            throw new AppError("E-mail e/ou senha incorretos", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({user, token})
    }
}

module.exports = SessionsController;