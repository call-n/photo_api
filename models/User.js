const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		albums() {
			return this.hasMany('albums');
		},
		photos() {
			return this.hasMany('photos');
		}
	}, {
		hashSaltRounds: 10,

		async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		},

		async login(email, password) {

			const user = await new this({ email }).fetch({ require: false });
			if (!user) {
				return false;
			}
			const hash = user.get('password');

			const result = await bcrypt.compare(password, hash);
			if (!result) {
				return false;
			}

			return user;
		}
	
	});
};
