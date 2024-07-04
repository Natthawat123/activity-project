import db from '../db.js'

export const manage = (req, res) => {
    const sql = "SELECT * FROM manage"
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'No activity table manage found'
            });
        }
        return res.json(result);
    })
<<<<<<< HEAD
}
=======
}

// delete
export const reserve = (req, res) => {
    const {
        act_ID,
        std_ID
    } = req.query;

    const sql = 'DELETE FROM manage WHERE act_ID = ? AND std_ID = ?';

    db.query(sql, [act_ID, std_ID], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json({
            message: 'Activity deleted successfully',
            result
        });
    });
};
>>>>>>> karan
