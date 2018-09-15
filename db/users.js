console.log('\nclass Users Started in users.js');
class Users {
  constructor() {
    this._count = 1;
    this._storage = [];
    this.add({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    });
  }
  all() {
    // console.log('class Users all()...this._storage =', this._storage);
    return [...this._storage];
  }
  getUserByInfo(username, password) {
    return this._storage.filter(item => username == item.username && password == item.password)[0];
  }
  getUserById(id) {
    console.log('getUserById =', id);
    return this._storage.filter(product => id == product.id)[0];
  }

  add(user) {
    // console.log('\nadd product =\n', product, '\n');
    user.id = this._count;
    this._storage.push(user);
    this._count++;
    return user.id;
  }
  // editPById(id) {
  //   // let productToEdit = Products_Inv.getItemById(id);
  //   let productToEdit = null;
  //   if (req.body.product !== productToEdit.product) {
  //     productToEdit.product = req.body.product;
  //   }
  //   if (req.body.price !== productToEdit.price) {
  //     productToEdit.price = req.body.price;
  //   }
  //   if ( req.body.inventory !== productToEdit.inventory) {
  //     productToEdit.inventory = req.body.inventory;
  //   }
  //   res.redirect(`/products/${id}`);
  // }

  deleteUserById(id) {
    let removedUser = null;
    console.log('deleteUserById =', id);
    // console.log('this._storage before =', this._storage);
    this._storage.forEach((element, index) => {
      if (element.id === Number(id)) {
        removedUser = this._storage.splice(index, 1);
      }
    });
    // console.log('this._storage after =', this._storage);

    return removedUser;
  }
}

module.exports = Users;

console.log('class Users Ended in users.js');
