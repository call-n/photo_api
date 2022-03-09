const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
 
const index = async (req, res) => {
    // trycatch if the user doesnt have any photos
    try {
        // fetches all the related photos to the user and displays them
        const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

        const photos = user.related('photos');

        res.send({
            status: 'success',
            data: photos,
        });
    } catch (error) {
        res.status(404).send({
            status: 'error',
            data: 'Photo(s) Not Found',
        });
        return;
    }
}
 
// show a specific photo
const show = async (req, res) => {
    // trycatch if the photo thats requested dosent exist
    try {
        // get the photo thats requested
        const photo = await new models.Photo({ id: req.params.photoId })
        .fetch();

        // check ownership of photo
        if(photo.attributes.user_id === req.user.user_id){
            res.status(200).send({
                status: 'success',
                data: photo,
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
            data: 'Photo Not Found',
        });
        return;
    }
}
 
// store photo
const store = async (req, res) => {
    // checks validation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }
 
    // get the the data for easier access
    const validData = matchedData(req);
    let userId = parseInt(req.user.user_id);

    // format the payload for saving
	const validDataRe = { 
        title: validData.title,
        url: validData.url,
        comment: validData.comment,
		user_id: userId,
	}
 
    // check that it saves correctly to the database
    try {
        const photo = await new models.Photo(validDataRe).save();
       
        res.send({
            status: 'success',
            data: photo,
        });
 
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new photo.',
        });
        throw error;
    }
}
 
// update a photo
const update = async (req, res) => {
    const photoId = req.params.photoId;

    // make sure photo exists
    const photo = await new models.Photo({ id: photoId }).fetch({ require: false });
    if (!photo) {
        res.status(404).send({
            status: 'fail',
            data: 'Photo Not Found',
        });
        return;
    }
 
    // check vaildation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }
 
    // retrieve data for easier access
    const validData = matchedData(req);
    const user_id = parseInt(req.user.user_id);

	// just to check that it's the right user
	if ( photo.attributes.user_id === user_id ) {
        // check so that its saves correctly to database
        try {
            const updatedPhoto = await photo.save(validData);
    
            res.send({
                 status: 'success',
                 data: updatedPhoto,
            });
     
        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: 'Exception thrown in database when updating a new photo.',
            });
            throw error;
        }
    } else {
        res.status(401).send({
            status: 'error',
            data: 'nonono, its not yours',
        })
    }
    
}
 
module.exports = {
    index,
    show,
    store,
    update,
}
 