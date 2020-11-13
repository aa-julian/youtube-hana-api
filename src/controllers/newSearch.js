'use strict';

const axios = require('axios');
const fs = require('fs');
const hdbext = require('@sap/hdbext');

module.exports = (req, res) => {


const rawFile = fs.readFileSync('default-services.json');
const hanaConfig = JSON.parse(rawFile).hana;

hdbext.createConnection(hanaConfig, (error, client) => {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    const key = 'AIzaSyC4DNwlVWOcqrOuFWKHv3DpPkGzJxjDbI0';
    const lat = '10.477926';
    const long = '-66.871557';
    const location = lat + ',' + long;
    const searchWord = decodeURIComponent(req.query.searchTerm);
    const maxResults = decodeURIComponent(req.query.maxResults) || 100;
    const radius = decodeURIComponent(req.query.radius) || 10;
    let newDate = new Date();
    const today = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();

    const url = `
        https://www.googleapis.com/youtube/v3/search?key=${encodeURIComponent(key)}&type=video&location=${encodeURIComponent(location)}&topicID=${encodeURIComponent(searchWord)}}
        &maxResults=${maxResults}&locationRadius=${encodeURIComponent(radius+'km')}&part=snippet&type=video
    `;

    const statement = client.prepare(
        `INSERT INTO "youtube_info" 
         VALUES (?,?,?,?,?,?,?,?,?,NEW ST_POINT(?),?,?);`
    );

    axios.get(url)
    .then(response => {
        let counter = 0;
        response.data.items.forEach(result => {

            const bindParams = [result.id.videoId, result.id.kind, today, result.snippet.publishedAt, result.snippet.title,
                result.snippet.description, result.snippet.thumbnails.default.url,result.snippet.channelTitle,result.snippet.publishTime,
                'Point ('+ long+' '+lat+')' ,parseInt(radius),searchWord];
          

            const ran_result = statement.exec(bindParams);
            counter += ran_result;
        });

        res.status(200).json({
            "info": counter + ' records have been inserted'
        });
    });

    
});

};