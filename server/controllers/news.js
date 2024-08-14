import db from '../db.js'


export const get = (req, res) => {
    const {
        id,
        role
    } = req.query;

    let sql;

    if (role == "student") {
        sql = `SELECT
                    *
                FROM
                    news
                LEFT JOIN activity ON activity.act_title = news.act_title
                WHERE
                    news_type = 'all'
                OR FIND_IN_SET(${id}, news_type) > 0;
                `

    } else {
        sql = `SELECT * FROM news WHERE news_type = 'all'`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });
};

export const getOne = (req, res) => {
    const {
        id
    } = req.body
    const sql = `
            SELECT * FROM news `
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const update = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        act_title,
        key
    } = req.body;

    const sql = `
        UPDATE news SET
            news_topic = ?,
            news_desc = ?,
            news_date = ?,
            news_create = ?,
            act_title = ?
        WHERE act_title = ?;
    `;

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_create,
        act_title,
        key
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        console.log("Update result:", result);
        return res.json(result);
    });
};

export const updateAct_title = (req, res) => {

    const {
        act_title,
        newAct_title
    } = req.body
    const sql = `
            UPDATE news SET
            act_title = ?
        WHERE act_title = ?
                `;
    db.query(sql, [newAct_title, act_title], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const deleteNews = (req, res) => {
    const {
        act_title
    } = req.body
    const sql = `
            DELETE FROM news WHERE news_ID = ?
                `
    db.query(sql, [act_title], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const addActivity = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        act_title
    } = req.body;
    const news_type = "all"

    const sql = `
            INSERT INTO news(news_topic, news_desc, news_date, news_create,news_type,act_title)
            VALUES( ? , ? , ? , ? ,?,?)
            `;

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_create,
        news_type,
        act_title
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });
};
// Example of backend error handling
export const newsCancelReserve = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        news_type,
        act_title
    } = req.body;

    const typeMap = news_type.join(',');
    const sql = `
        INSERT INTO news(news_topic, news_desc, news_date, news_create, news_type, act_title)
        VALUES(?,?,?,?,?,?)
    `;

    db.query(sql, [news_topic, news_desc, news_date, news_create, typeMap, act_title], (err, result) => {
        if (err) {
            console.error("Error inserting news:", err); // Log the error
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(result);
    });
};


export const upload = (req, res) => {
    const sql = `
        INSERT INTO news(news_topic, news_desc, news_date, news_create, news_type, act_title)
        VALUES(?,?,?,?,?,?)
        `
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        studentIDs,
        act_title,
    } = req.body
    const news_type = studentIDs.join(',');

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_create,
        news_type,
        act_title
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });

}