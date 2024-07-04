import db from '../db.js'

// student
export const student = (req, res) => {
    const id = req.params.id;
    const {
<<<<<<< HEAD
        fname,
        lname,
        section,
        email,
        mobile,
        address,
=======
        std_fname,
        std_lname,
        sec_ID,
        std_email,
        std_mobile,
        std_address,
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
        province,
        district,
        subdistrict,
        zipcode
    } = req.body;

    const q = `
        UPDATE student 
        SET std_fname = ?, 
            std_lname = ?, 
            sec_ID = ?, 
            std_email = ?, 
            std_mobile = ?, 
            std_address = ?, 
            province = ?, 
            district = ?, 
            subdistrict = ?, 
            zipcode = ? 
        WHERE std_ID = ?
    `;

<<<<<<< HEAD
    db.query(q, [fname, lname, section, email, mobile, address, province, district, subdistrict, zipcode, id], (err, result) => {
=======
    db.query(q, [std_fname, std_lname, sec_ID, std_email, std_mobile, std_address, province, district, subdistrict, zipcode, id], (err, result) => {
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json({
            message: 'Student updated successfully',
            result
        });
    });
};

// staff
export const staff = (req, res) => {
<<<<<<< HEAD
    const {
        id
    } = req.params.id
    const {
        fname,
        lname,
        email,
        mobile,
        address,
=======
    const id = req.params.id
    const {
        staff_fname,
        staff_lname,
        staff_email,
        staff_mobile,
        staff_address,
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
        province,
        district,
        subdistrict,
        zipcode
    } = req.body
    const q = 'UPDATE `staff` SET `staff_fname`= ?,`staff_lname`= ?,`staff_email`= ?,`staff_mobile`= ?,`staff_address`= ?,`province`= ?,`district`= ?,`subdistrict`= ?,`zipcode`= ? WHERE staff_ID = ?'

<<<<<<< HEAD
    db.query(q, [fname, lname, email, mobile, address, province, district, subdistrict, zipcode, id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
=======
    db.query(q, [staff_fname,
        staff_lname, staff_email, staff_mobile, staff_address, province, district, subdistrict, zipcode, id], (err, result) => {
            if (err) return res.status(500).json(err)
            return res.json(result)
        })
>>>>>>> cd46f31 (update upload and delete to blockchain reserve once)
}