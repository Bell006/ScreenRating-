const { verify } = require("jsonwebtoken");
const AppError = require("../Utils/AppError");
const authConfig = require("../Configs/auth");

function ensureAuthentication(request, response, next) {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError("JWT Token não informado.", 401);
    }

    //"Bearer xxxxx" = Omitindo o primeiro elemento e armazenando o segundo (token)
    const [, token] = authHeader.split(" ");

    //verificando se o user_id do token é válido
    try {
        const { sub: user_id } = verify(token, authConfig.jwt.secret);

        request.user = {
            id: Number(user_id),
        };

        return next();
    } catch {
        throw new AppError("JWT Token inválido.", 401);
    }
}

module.exports = ensureAuthentication;
