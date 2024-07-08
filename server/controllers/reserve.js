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

// increase numStdReserve
export const numStdReserve = (req, res) => {
    const {
        act_ID,
        numStdReserve
    } = req.body;

    const q = `UPDATE activity SET act_numStdReserve = ? WHERE act_ID = ?`;

    db.query(q, [numStdReserve, act_ID], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json('Reserved successfully');
    });
};