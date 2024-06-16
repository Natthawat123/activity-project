import db from '../db.js'

// login
export const login = (req, res) => {
    const q = 'SELECT * FROM login'

    db.query(q, (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

// student
export const student = (req, res) => {
    const q = `
        SELECT student.*, section.sec_Name 
        FROM student 
        JOIN section ON student.sec_ID = section.sec_ID
    `

    db.query(q, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'No students found'
            });
        }
        return res.json(result);
    });
}

// activity
export const activity = (req, res) => {
    const q = 'SELECT * FROM activity'

    db.query(q, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(result);
    })
}

//section
export const section = (req, res) => {
    const q = 'SELECT * FROM section '

    db.query(q, (err, result) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(result);
    })
}