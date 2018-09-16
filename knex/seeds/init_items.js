exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return  knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {product: 'Apple', price: 0.97, inventory: 200},
        {product: 'Orange', price: 0.98, inventory: 150},
        {product: 'Banana', price: 0.99, inventory: 100}
        // {name: 'Apple of Doom', description: 'Rains down sploding applez!!' },
        // {name: 'Banana Peel of Extinction', description: 'Extincts all players in 10 meter radius.'},
        // {name: 'Pineapple Blades of Paradise', description: 'Inflicts cutting dabage and sends target to "Paradise"'}
      ]);
    });
};