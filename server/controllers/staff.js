import db from '../db.js'


// read  student list
export const read = (req, res) => {
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
};

// update
export const update = (req, res) => {
    const {
        id
    } = req.params.id
    const {
        fname,
        lname,
        email,
        mobile,
        address,
        province,
        district,
        subdistrict,
        zipcode
    } = req.body
    const q = 'UPDATE `staff` SET `staff_fname`= ?,`staff_lname`= ?,`staff_email`= ?,`staff_mobile`= ?,`staff_address`= ?,`province`= ?,`district`= ?,`subdistrict`= ?,`zipcode`= ? WHERE staff_ID = ?'

    db.query(q, [fname, lname, email, mobile, address, province, district, subdistrict, zipcode, id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

// ประวัติส่วนตัว
export const resume = (req, res) => {
    const {
        id
    } = req.query;
    const query = 'SELECT * FROM staff WHERE login_ID = ?';

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