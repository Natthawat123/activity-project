import db from '../db.js'

// student
export const student = (req, res) => {
    const {
        id
    } = req.query;
<<<<<<< HEAD
    const query = 'SELECT student.*, section.sec_Name FROM student JOIN section ON student.sec_ID = section.sec_ID WHERE std_ID = ?';
=======
<<<<<<< HEAD
    const query = 'SELECT student.*, section.sec_Name FROM student JOIN section ON student.sec_ID = section.sec_ID WHERE login_ID = ?';
=======
    const query = 'SELECT student.*, section.sec_Name FROM student JOIN section ON student.sec_ID = section.sec_ID WHERE std_ID = ?';
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
            return;
        }

        if (results.length > 0) {
            console.log('User data:', results[0]);
            res.json(results[0]);
        } else {
            console.log('User not found');
            res.status(404).json({
                message: 'User not found'
            });
        }
    })
}

// staff
export const staff = (req, res) => {
    const {
        id
    } = req.query;
<<<<<<< HEAD
    const query = 'SELECT * FROM staff WHERE staff_ID = ?';
=======
<<<<<<< HEAD
    const query = 'SELECT * FROM staff WHERE login_ID = ?';
=======
    const query = 'SELECT * FROM staff WHERE staff_ID = ?';
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
>>>>>>> karan

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
            return;
        }

        if (results.length > 0) {
            console.log('User data:', results[0]);
            res.json(results[0]);
        } else {
            console.log('User not found');
            res.status(404).json({
                message: 'User not found'
            });
        }
    })
}