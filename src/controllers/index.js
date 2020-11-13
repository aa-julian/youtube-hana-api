'use strict';

module.exports = (req, res) => {
    res.render('index', {
        title: 'YouTube API',
        name: 'SAP NS2'
    });
};