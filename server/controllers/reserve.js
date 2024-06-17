import db from '../db.js'

// reserve
export const activity = (req, res) => {
    const q = 'INSERT INTO `manage` (`man_status`, `std_ID`, `act_ID`) VALUES (?, ?, ?)';
    const {
        man_status,
        std_ID,
        act_ID
    } = req.body;

    db.query(q, [man_status, std_ID, act_ID], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(' reserved successfully');
    })
}