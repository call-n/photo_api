const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

const index = async (req, res) => {
	const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

	const albums = user.related('albums');

	res.send({
		status: 'success',
		data: albums,
	});
}

// show the album and all it photos
const show = async (req, res) => {
	
	const album = await new models.Album({ id: req.params.albumId })
		.fetch({ withRelated: ['photos'] });

	if(album.attributes.user_id === req.user.user_id){
		res.status(200).send({
			status: 'success',
			data: album,
		})
	} else {
		res.status(401).send({
			status: 'error',
			data: 'nonono, its not yours',
		})
	}
}

// store album
const store = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const validData = matchedData(req);
	let userId = parseInt(req.user.user_id);

	const validDataRe = { 
		title: validData.title,
		user_id: userId
	}

	try {
		const album = await new models.Album(validDataRe).save();
		
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

	const user_id = parseInt(req.user.user_id);

	const album = await new models.Album({ id: req.params.albumId }).fetch();

	// just to check that it's the right user
	if ( album.attributes.user_id === user_id ) {
		
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
				data: null,
			});

		} catch (error) {
			res.status(500).send({
				status: 'error',
				message: 'Exception thrown in database when creating a new album.',
			});
			throw error;
		}
	} else {
		res.status(401).send({
			status: 'error',
			message: 'This is not your album',
		})
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

	const user_id = parseInt(req.user.user_id);

	// just to check that it's the right user
	if ( album.attributes.user_id === user_id ) {
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
	} else {
		res.status(401).send({
			status: 'error',
			message: 'This is not your album',
		});
	}
}

module.exports = {
	index,
	show,
	store,
	storePhoto,
	update,
}
