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
}

// delete
export const reserve = (req, res) => {
    const {
        act_ID,
    } = req.params;

    const sql = 'DELETE FROM manage WHERE act_ID = ? ';

    db.query(sql, [act_ID], (err, result) => {
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

// update
export const update = (req, res) => {
    const {
        id
    } = req.params; // Extract act_ID from query parameters
    const {
        act_title,
        act_desc,
        act_dateStart,
        act_dateEnd,
        act_numStd,
        act_location,
        staff_ID,
        act_status,
        act_transaction
    } = req.body; // Extract other fields from request body

    const sql = `UPDATE activity SET
        act_title = ?,
        act_desc = ?,
        act_dateStart = ?,
        act_dateEnd = ?,
        act_numStd = ?,
        act_location = ?,
        staff_ID = ?,
        act_status = ?,
        act_transaction = ?
        WHERE act_ID = ?`; // Correct SQL query with placeholders

    db.query(sql, [
        act_title,
        act_desc,
        act_dateStart,
        act_dateEnd,
        act_numStd,
        act_location,
        staff_ID,
        act_status,
        act_transaction,
        id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json({
            message: 'Activity updated successfully',
            result
        });
    });
};
export const transection = (req, res) => {
    const {
        id
    } = req.params; // Extract act_ID from query parameters
    const {
        act_transaction
    } = req.body; // Extract other fields from request body

    const sql = `UPDATE activity SET
       
        act_transaction = ?
        WHERE act_ID = ?`;

    db.query(sql, [

        act_transaction,
        id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json({
            message: 'transection updated successfully',
            result
        });
    });
};


// getAll
export const get = (req, res) => {
    const sql = "select * from activity"
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'No activity found'
            });
        }
        return res.json(result);
    })
}

// get one
export const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "select * from activity where act_ID = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'No activity found'
            });
        }
        return res.json(result);
    })
}

export const deleteActivity = (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM activity WHERE act_ID = ?";

    db.query(sql, [id], (err, result) => {
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
}

// update status
export const updateStatus = (req, res) => {
    const id = req.params.id;
    const status = 2;
    const sql = 'UPDATE activity SET act_status = ? WHERE act_ID = ?';

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json({
            message: 'Activity updated successfully',
            result
        });
    });
};