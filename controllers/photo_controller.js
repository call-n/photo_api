const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
 
const index = async (req, res) => {
    const user = await models.User.fetchById(req.user.user_id, { withRelated: ['photos'] });

	const photos = user.related('photos');

    res.send({
        status: 'success',
        data: photos,
    });
}
 
const show = async (req, res) => {
    try {
        const photo = await new models.Photo({ id: req.params.photoId })
        .fetch();

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
 
const store = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }
 
    const validData = matchedData(req);
    let userId = parseInt(req.user.user_id);

	const validDataRe = { 
        title: validData.title,
        url: validData.url,
        comment: validData.comment,
		user_id: userId,
	}
 
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
 
    const errors = validationResult(req);
     
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }
 
    const validData = matchedData(req);
 
    const user_id = parseInt(req.user.user_id);

	// just to check that it's the right user
	if ( photo.attributes.user_id === user_id ) {
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
 