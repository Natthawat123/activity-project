import db from '../db.js';

export const deleteStd = (req, res) => {
    const {
        id
    } = req.params;

    const sql1 = 'DELETE FROM student WHERE login_ID = ?';
    const sql2 = 'DELETE FROM login WHERE login_ID = ?';

    // First, delete from the 'student' table
    db.query(sql1, [id], (err, result1) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        // Then, delete from the 'login' table
        db.query(sql2, [id], (err, result2) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            // Both deletions successful
            return res.json({
                message: 'Records deleted successfully from both tables',
                studentResult: result1,
                loginResult: result2
            });
        });
    });
};