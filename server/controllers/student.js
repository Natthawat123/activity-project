import db from '../db.js';

//create
export const createStudent = (req, res) => {
    const {
        login_ID,
        std_fname,
        std_lname,
        sec_ID,
        std_email,
        std_mobile,
        std_address,
        province,
        district,
        subdistrict,
        zipcode
    } = req.body;

    const sql = `
        INSERT INTO student
            (login_ID, std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode) 
        VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.query(sql, [
        login_ID,
        std_fname,
        std_lname,
        sec_ID,
        std_email,
        std_mobile,
        std_address,
        province,
        district,
        subdistrict,
        zipcode
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}

//read all
export const getStudent = (req, res) => {
    const sql = `
   SELECT 
    section.*,
    student.*,
    t.staff_fname,
    t.staff_lname,
    t.staff_email,
    t.staff_mobile,
    t.staff_address
FROM student
left JOIN section ON section.sec_ID = student.sec_ID
left JOIN teacher t ON t.sec_ID = student.sec_ID;

    `

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })

}

//read one
export const getstudentOne = (req, res) => {
    const sql = `
        select
            student.*,
            teacher.staff_fname,
            teacher.staff_lname,
            section.*,
            login.*
        from 
            student 
        left join section on section.sec_ID = student.sec_ID
        left join teacher on teacher.sec_ID = student.sec_ID
        left join login on login.username = student.login_ID
         where student.login_ID = ?
    `
    const {
        id
    } = req.params

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        return res.json(result[0]);
    })
}

// update
export const updateStudent = (req, res) => {
    const sql = `
        UPDATE student 
        SET 
            std_fname = ?, 
            std_lname = ?, 
            sec_ID = ?, 
            std_email = ?, 
            std_mobile = ?, 
            std_address = ?, 
            province = ?, 
            district = ?, 
            subdistrict = ?, 
            zipcode = ? 
        WHERE login_ID = ?
    `
    const {
        id
    } = req.params;
    const {
        std_fname,
        std_lname,
        sec_ID,
        std_email,
        std_mobile,
        std_address,
        province,
        district,
        subdistrict,
        zipcode
    } = req.body;

    db.query(sql, [std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}

// delete
export const deleteStudent2 = (req, res) => {
    const sql = `delete from student  where login_ID = ? `
    const {
        id
    } = req.params

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}

export const deleteStudent = (req, res) => {
    const {
        id
    } = req.params;

    const sql1 = 'DELETE FROM student WHERE login_ID = ?';
    const sql2 = 'DELETE FROM login WHERE username = ?';

    db.query(sql1, [id], (err, result1) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        db.query(sql2, [id], (err, result2) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            return res.json({
                message: 'Records deleted successfully from both tables',
                studentResult: result1,
                loginResult: result2
            });
        });
    });
};