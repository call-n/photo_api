const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// index all the albums for user
const index = async (req, res) => {
	// this trycatch is just to check that there is albums for the user
	try {
		// fetches the albums that are relate to the user and displays them
		const user = await models.User.fetchById(req.user.user_id, { withRelated: ['albums'] });

		const albums = user.related('albums');

		res.send({
			status: 'success',
			data: albums,
		});
	} catch (error) {
		res.status(404).send({
			status: 'error',
			data: 'Album(s) Not Found',
		});
		return;
	}
}

// show the album and all it photos
const show = async (req, res) => {
	// this trycatch is just to check that there is albums for the user
	try {
		const album = await new models.Album({ id: req.params.albumId })
			.fetch({ withRelated: ['photos'] });

		// Just to check that the logged in user only can access their own albums
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
	} catch (error) {
		res.status(404).send({
			status: 'error',
			data: 'Album Not Found',
		});
		return;
	}
}

// store album
const store = async (req, res) => {
	// validation rules checker
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// retrieve the data validated data and the user_id for easier access
	const validData = matchedData(req);
	let userId = parseInt(req.user.user_id);

	// format the payload so we can save it with the users data and id
	const validDataRe = { 
		title: validData.title,
		user_id: userId
	}

	// save the data to new album
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
	// validation rules checker
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// retrieve the user_id and the album
	const user_id = parseInt(req.user.user_id);
	const album = await new models.Album({ id: req.params.albumId }).fetch();

	// just to check that it's the right user
	if ( album.attributes.user_id === user_id ) {
		
		// retrieve the data validated data and the user_id for easier access
		const validData = matchedData(req);
		let albumId = parseInt(req.params.albumId);

		// format the payload so we can save it with the users data and id
		const validDataRe = { 
			album_id: albumId,
			photo_id: validData.photo_id
		}
		// just to see if it gets stored
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
	// if the album is not found
	if (!album) {
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	// if validation rules doesnt match
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const user_id = parseInt(req.user.user_id);

	// just to check that it's the right user
	if ( album.attributes.user_id === user_id ) {
		const validData = matchedData(req);

		// just to make sure that it saves correctly
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
