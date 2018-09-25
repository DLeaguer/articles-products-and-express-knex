
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('articles').del()
    .then(function () {
      // Inserts seed entries
      return knex('articles').insert([
        {title: 'The Hunger Games', body: 'last survivor lives', author: 'Suzanne Collins'},
        {title: 'Divergent', body: 'Tris\'s secret means her death but could save her loved ones', author: 'Veronica Roth'},
        {title: 'The Maze Runner', body: 'a changing maze is the only way out which no one has survived', author: 'James Dashner'}
      ]);
    });
};
