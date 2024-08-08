import db from '../db.js'

export const get = (req, res) => {
    const sql = `
        SELECT * FROM news
    `
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const getOne = (req, res) => {
    const {
        id
    } = req.body
    const sql = `
        SELECT * FROM news
    `
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
        id
    } = req.params
    const {
        news_topic,
        news_desc,
        news_date,
        news_login_ID
    } = req.body
    const sql = `
        UPDATE  news SET 
            news_topic = ?,
            news_desc = ?,
            news_date = ?,
            news_login_ID = ?
        WHERE news_ID = ?
    `;
    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_login_ID,
        id
    ], (err, result) => {
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
        id
    } = req.body
    const sql = `
        DELETE FROM news WHERE news_ID = ?
    `
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const add = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_login_ID
    } = req.body;
    const sql = `
        INSERT INTO news (news_topic, news_desc, news_date, news_login_ID)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_login_ID
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });
};