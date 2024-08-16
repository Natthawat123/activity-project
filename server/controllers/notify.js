import db from '../db.js'

export const get = (req, res) => {
    const sql = `
        SELECT * FROM notify
        inner join news on news.news_ID = notify.news_ID
        where notify.user_ID = ?
        `
    const {
        id
    } = req.query

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

export const read = (req, res) => {
    const {
        news_ID,
        user_ID
    } = req.body
    const sql = `update notify set notify_status = "read" where news_ID = ? and user_ID = ?`
    db.query(sql, [news_ID, user_ID], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}