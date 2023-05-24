const { hash, compare } = require("bcryptjs")
const knex = require("../database/knex");
const AppError = require("../Utils/AppError");

class UsersController  {
   async create(request, response) {
        const { name, email, password, avatar } = request.body;

        if(!name || !email) {
            throw new AppError("Nome e email são dados obrigatórios!")
        };

        let checkIfUserExists;
        
        await knex("users").select("email").where('email', email).then((result) => {
            if(result.length != 0) {
                throw new AppError("Este email já está em uso.")
            }
        })

        const hashedPassword = await hash(password, 8);

        const users = await knex("users").insert({
            name,
            email,
            password: hashedPassword,
            avatar
        }) 

        return response.status(201).json("Usuário cadastrado com sucesso!")
    }

    async update(request, response) {
        const { name, email, old_password, password, avatar} = request.body;
        const user_id = request.user.id;

        const user = await knex("users").select("*").where("id", user_id).first()

        let newPassword;

        if(user.length === 0) {
            throw new AppError("Usuário não encontrado.")
        }

        if(email) {
            const checkifEmailExists = await knex("users").select("email").where("email", email);
    
            
            if(checkifEmailExists != 0) {
                throw new AppError("Este email já está em uso.")
            }
        }

        if(password && !old_password) {
            throw new AppError("Você precisa informar sua senha antiga para utilizar uma nova.")
        }

        if(old_password && password) {
            const checkingPasswords = await compare(old_password, user.password)

            if(!checkingPasswords) {
                throw new AppError("A senha antiga não confere.")
            }

            newPassword = await hash(password, 8)
        }

        //caso os campos estejam em branco, deixar como estava
        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.password = password ?? user.password;
        user.avatar = avatar ?? user.avatar;

        
        const updatedUser = await knex("users").where("id", user_id).update({
        name,
        email,
        password: newPassword,
        avatar,
        updated_at: new Date()
        })
        

        return response.status(200).json("Atualizações concluídas com sucesso!")
    }

    async delete(request, response) {
      const { id } = request.params;

      await knex("users").where({ id }).delete();

      return response.status(200).json("Usuário deletado :(")
    }
}

module.exports = UsersController;