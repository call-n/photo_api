module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'albums',
		users() {
			return this.belongsTo('User');
		},
		albums(){
			return this.belongsToMany('AlbumPhotos');
		}
	});
};
