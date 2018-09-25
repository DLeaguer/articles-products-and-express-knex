
exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', function(table) {
    table.increments();
    table.string('title').notNullable();
    table.string('body').notNullable();
    table.string('author').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};
