const logger = require('.logger');

function succcessResponse(res, data) {
    res.status(200).json({status: 'success', data});
}