import db from '../db.js'

// read All
export const readManage = (req, res) => {
    const sql = `SELECT * FROM manage 
    LEFT JOIN 
        activity 
    ON 
        manage.act_ID = activity.act_ID 
    left join 
        teacher
    on 
        activity.staff_ID = teacher.login_ID
    left join
        student
    on manage.std_ID = student.login_ID
    left join
        section
    on student.sec_ID = section.sec_ID
    where 
        activity.act_status = 1 
    `
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: "Data not found"
            });
        }
        return res.json(result);
    });
}
export const readManageOne = (req, res) => {
    const {
        id
    } = req.params;
    const sql = `
    SELECT 
        manage.*,
        activity.*,
        student.*,
        teacher.staff_fname,
        teacher.staff_lname,
        section.sec_name
    FROM manage 
        LEFT JOIN activity ON activity.act_ID = manage.act_ID 
        LEFT JOIN student ON student.login_ID = manage.std_ID
        LEFT JOIN teacher ON teacher.login_ID = activity.staff_ID
        LEFT JOIN section ON section.sec_ID = student.sec_ID
    WHERE 
        manage.act_ID = ?`
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: "Data not found"
            });
        }
        return res.json(result);
    });
}

// reserve
export const reserveActivity = (req, res) => {
    const sql = `
        INSERT INTO manage 
            (man_status, std_ID, act_ID) 
        VALUES 
            (?, ?, ?)
        `
    const {
        man_status,
        std_ID,
        act_ID,
    } = req.body;

    db.query(sql, [man_status, std_ID, act_ID], (err, result) => {
        if (err) return res.status(500).json(err)

        const sql2 = `UPDATE activity SET act_numStdReserve = act_numStdReserve + 1 WHERE act_ID = ?`;
        db.query(sql2, [act_ID], (err2, result2) => {
            if (err2) return res.status(500).json(err2)
            return res.status(200).json('Reserved successfully');
        })
    })
}

// cancel reserve
export const cancelReserve = (req, res) => {
    const sql = `DELETE FROM manage WHERE std_ID = ? AND act_ID = ?`;
    const {
        std_ID,
        act_ID
    } = req.body;

    db.query(sql, [std_ID, act_ID], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json('Deleted Reserve successfully');
    });
};

// after cancer reserve then decrease numStd in activity
export const decreaseNumStd = (req, res) => {
    const sql = `UPDATE activity SET act_numStdReserve = act_numStdReserve - ? WHERE act_ID = ?`
    const {
        act_ID,
        cancelReserveNumStd,
    } = req.body;
    db.query(sql, [cancelReserveNumStd, act_ID], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json('Decreased numStd in activty successfully');
    })
}

export const upload = (req, res) => {
    const q = `
        SELECT activity.*, manage.std_ID, student.std_fname, student.std_lname
        FROM activity 
        JOIN manage ON activity.act_ID = manage.act_ID
        JOIN student ON manage.std_ID = student.login_ID
    `;

    db.query(q, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
};