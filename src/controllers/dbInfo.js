'use strict';


module.exports = (req, res) => {
    const hdb = req.db;

    var sql = '';

    var bindParams = [];


    sql = `
    SELECT "search_word", COUNT("search_word") FROM "youtube_info"
    GROUP BY "search_word";
    `;

    //HANA DB Connection and call
    try {
        const rows = hdb.exec(sql, bindParams);
        res.status(200).json({
            data: rows
        });
    } catch (err) {
        console.error(err);
        console.error(sql, bindParams);
        res.status(500).json({
            error: `[SQL Execute error]: ${err.message}`
        });
    }


};