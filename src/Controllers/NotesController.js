const knex = require("../database/knex");
const AppError = require("../Utils/AppError");

class NotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const user_id = request.user.id;

        if(!title) {
            throw new AppError("O título é obrigatório")
        }

        if(rating > 5 || rating < 0) {
            throw new AppError("O valor da nota deve estar entre 0 e 5.");
        }

        const [ note_id ] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });
        
        const tagsInsert = tags.map(name => {
            return {
                name,
                user_id,
                note_id
            }
        })

       await knex("movie_tags").insert(tagsInsert)

       return response.status(200).json("Nota cadastrada com sucesso!")
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete()

        return response.status(200).json("Nota deletada.")
    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("movie_notes").where({ id }).first();

        const tags = await knex("movie_tags").where("note_id", id).select("name");

        return response.status(200).json({
            ...note,
            tags
        })
    }

    async index(request, response) {
        const { title, tags } = request.query;

        const user_id = request.user.id;

        let notes;

        if(tags) {
            const filteredTags = tags.split(",").map(tag => tag.trim())
            
            notes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.description",
                "movie_notes.rating",
                "movie_notes.user_id"
            ])
            .where( "movie_notes.user_id", user_id )
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filteredTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")

        } else if(title) {
            notes = await knex("movie_notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        } else {
            notes = await knex("movie_notes")
            .where({ user_id })
            .orderBy("title");
        }

        const userTags = await knex("movie_tags").where({ user_id });
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags,
            }
        }); 
    
        return response.status(200).json(notesWithTags)
    }
};

module.exports = NotesController;