module.exports = (bookshelf) => {
	return bookshelf.model('AlbumPhotos', {
		tableName: 'album_photos',
		photos() {
			return this.belongsToMany('Album');
		},
        albums() {
			return this.belongsToMany('Photo');
		}
	});
};
