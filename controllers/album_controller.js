const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

const index = async (req, res) => {
	const albums = await models.Album.fetchAll();

	res.send({
		status: 'success',
		data: albums,
	});
}

const show = async (req, res) => {
	// this is the album we are searching for
	const album = await new models.Album({ id: req.params.albumId })
		.fetch();
	
	// this is to get all the albums with photos
	const albumPhotos = await new models.AlbumPhotos({ album_id: req.params.albumId }).fetchAll();

	// filter out all the photos that are not connected to the specific albumId
	const photosWithAlbumId = albumPhotos
	.filter(photo => photo.attributes.album_id == req.params.albumId)
	
	const photoIds = []
	const photos = []
	// get all the photos from the photos that we got out
	photosWithAlbumId.map(photo => {
		photoIds.push(photo.attributes.photo_id)
	})

	// Loop over all image ids
	photoIds.forEach( async photo => {
		photos.push( 
			await new models.Photo({ id: photo }).fetch()
		);

		// this triggers when we got all the images fetched
		if(photoIds.length === photos.length ){
			res.status(200).send({
				status: 'success',
				data: { 
					id: album.attributes.id,
					title: album.attributes.title,
					photos: photos,
				},
			})
		}
	});
}

// store album
const store = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const validData = matchedData(req);

	try {
		const album = await new models.Album(validData).save();
		
		res.send({
			status: 'success',
			data: album,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
}

// store Photo in album
const storePhoto = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const validData = matchedData(req);
	let albumId = parseInt(req.params.albumId);

	const validDataRe = { 
		album_id: albumId,
		photo_id: validData.photo_id
	}
	try {
		const album = await new models.AlbumPhotos(validDataRe).save();
		
		res.send({
			status: 'success',
			data: album,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
}

const update = async (req, res) => {
	const albumId = req.params.albumId;

	const album = await new models.Album({ id: albumId }).fetch({ require: false });
	if (!album) {
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const validData = matchedData(req);

	try {
		const updatedAlbum = await album.save(validData);
		
		res.send({
			status: 'success',
			data: updatedAlbum,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
	storePhoto,
	update,
}
