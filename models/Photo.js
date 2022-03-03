module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'photos',
		users() {
			return this.belongsTo('User');
		},
		photos(){
			return this.belongsToMany('AlbumPhotos');
		}
	});
};
