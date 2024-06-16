import db from '../db.js'

//read
export const read = (req, res) => {
    const q = 'SELECT * FROM activity'

    db.query(q, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
    })
}

//create
export const create = (req, res) => {
    const q = 'INSERT INTO activity(`act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_location`, `staff_ID`, `act_status`, `act_createAt`) VALUES (?, ?, ?, ?, ?, ?, ?, 1 , ?)'
    const {
        act_title,
        act_desc,
        act_dateStart,
        act_dateEnd,
        act_numstd,
        act_location,
        staff_ID
    } = req.body

    db.query(q, [act_title, act_desc, act_dateStart, act_dateEnd, act_numstd, act_location, staff_ID, 1, new Date()], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}