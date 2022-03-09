module.exports = (bookshelf) => {
	return bookshelf.model('AlbumsPhotos', {
		tableName: 'albums_photos',
	});
};
