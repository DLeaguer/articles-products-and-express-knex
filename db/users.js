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
    return [...this._storage];
  }
  getUserByInfo(username, password) {
    return this._storage.filter(item => username == item.username && password == item.password)[0];
  }
  getUserById(id) {
    return this._storage.filter(product => id == product.id)[0];
  }
  add(user) {
    user.id = this._count;
    this._storage.push(user);
    this._count++;
    return user.id;
  }
  deleteUserById(id) {
    let removedUser = null;
    this._storage.forEach((element, index) => {
      if (element.id === Number(id)) {
        removedUser = this._storage.splice(index, 1);
      }
    });
    return removedUser;
  }
}

module.exports = Users;

console.log('class Users Ended in users.js');
