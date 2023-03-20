exports.up = knex => knex.schema.createTable("movie_tags", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.integer("user_id").references("id").inTable("users") //forein key do usuário
    table.integer("note_id").references("id").inTable("movie_notes").onDelete("CASCADE")
     //deleta todas as tags relacionadas a nota que foi deletada
});


exports.down = knex => knex.schema.dropTable("movie_tags");
