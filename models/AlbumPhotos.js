module.exports = (bookshelf) => {
	return bookshelf.model('AlbumPhotos', {
		tableName: 'album_photos',
	});
};
