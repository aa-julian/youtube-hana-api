'use strict';

module.exports = (req, res) => {
    const hdb = req.db;

    var sql = '';

    let searchWord = decodeURIComponent(req.query.searchTerm);
    var bindParams = [];


    sql = `
    SELECT * FROM "youtube_info"
    WHERE "search_word" LIKE '${searchWord}';
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