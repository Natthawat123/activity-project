import db from '../db.js'

// login
export const login = (req, res) => {
    const q = 'SELECT * FROM login'

    db.query(q, (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}