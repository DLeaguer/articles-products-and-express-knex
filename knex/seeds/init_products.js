
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {product: 'Apple', price: 0.89, inventory: 50},
        {product: 'Orange', price: 0.98, inventory: 50},
        {product: 'Banana', price: 0.79, inventory: 25},
      ]);
    });
};
